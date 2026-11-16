// @ts-nocheck
// CabinVolt safety engine. No network, no telemetry, no optimistic safety claims.
// A lookup is a dated reference check, never a flight clearance or certification.
export function normalize(value: any = '') {
  return String(value).normalize('NFKC').toUpperCase().replace(/[^A-Z0-9]/g, '');
}
export function matchModel(input: any, models: any[] = []) {
  const query = normalize(input);
  if (query.length < 3) return null;
  const matches = models.filter(m => [m.model, ...(m.aliases || []), `${m.brand} ${m.model}`].some(k => normalize(k) === query));
  return matches.length === 1 ? matches[0] : null;
}
export function findModel(id: any, models: any[] = []) { return models.find(m => m.id === id) || null; }
export function findAirline(id: any, airlines: any[] = []) { return airlines.find(a => a.id === id) || null; }
export function calculateWh(mah: any, volts: any) {
  if (mah === '' || volts === '' || mah == null || volts == null) return null;
  const m = Number(mah), v = Number(volts);
  if (!Number.isFinite(m) || !Number.isFinite(v) || m < 100 || m > 150000 || v < 2 || v > 30) return null;
  return Math.round(m * v / 10) / 100;
}
const priority = {danger:3,caution:2,info:1};
const modelDanger = new Set(['recall-all', 'serial-affected', 'batch-affected', 'unit-recalled', 'seller-us-affected']);
const meaningful = value => value != null && String(value).trim() !== '';
const numericWh = value => {
  if (!meaningful(value)) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 && n <= 10000 ? n : null;
};
export function evaluateLookup(input: any, registry: any, now: Date = new Date()) {
  const model = input.modelId ? findModel(input.modelId, registry.models) : matchModel(input.modelText, registry.models);
  const airline = findAirline(input.airlineId, registry.airlines);
  const typedWh = numericWh(input.whInput);
  const computedWh = calculateWh(input.mah, input.volts);
  const officialWh = numericWh(model?.wh);
  const wh = typedWh ?? computedWh ?? officialWh;
  const whOrigin = typedWh != null ? 'label' : computedWh != null ? 'calculated' : officialWh != null ? 'official' : 'unknown';
  const conflictingRatings = [typedWh,computedWh,officialWh].filter(v => v != null);
  const whConflict = conflictingRatings.length > 1 && Math.max(...conflictingRatings) - Math.min(...conflictingRatings) > 2;
  const reasons = [];
  const add = (level, code, sourceKeys = [], group='flight', meta={}) => reasons.push({level,code,sourceKeys,group,...meta});
  const serial = normalize(input.serial || '');
  const from = String(input.from || '').toUpperCase(), to = String(input.to || '').toUpperCase(), via = String(input.via || '').toUpperCase();
  const india = [from,to,via].includes('IN');
  const sourceKey = airline?.source;
  const countValue = input.quantity === undefined || input.quantity === '' ? 1 : Number(input.quantity);
  const quantity = Number.isInteger(countValue) && countValue >= 1 && countValue <= 10000 ? countValue : null;
  const modelKeys = model?.sources || [];
  if (model) {
    if (model.issue === 'regulator-ban') {
      if (india) add('danger','india-ban',modelKeys,'flight');
      else add('caution','india-ban-other-route',modelKeys,'flight');
    } else if (model.issue === 'recall') {
      switch (model.scope) {
        case 'all': add('danger','recall-all',modelKeys,'recall');break;
        case 'serial-check':
        case 'batch-check': add('caution','recall-check',modelKeys,'recall');break;
        case 'serial-prefix': {
          const matches = (model.serialPrefixes || []).some(p => serial.startsWith(normalize(p)));
          const requiredLength = model.id === 'bpb002' ? 14 : null;
          if (matches && (!requiredLength || serial.length === requiredLength)) add('danger','serial-affected',modelKeys,'recall');
          else if (matches) add('caution','serial-length-check',modelKeys,'recall');
          else if (serial) add('info','serial-not-listed',modelKeys,'recall');
          else add('caution','serial-needed',modelKeys,'recall');
          // A distinct UK/model-level advisory must not be silently cleared by a non-US serial.
          if (model.regionAdvisory) add('caution','region-advisory',[model.regionAdvisory],'recall');
          break;
        }
        case 'manufacture-range': {
          const date = String(input.manufactureDate || '');
          const valid = /^\d{4}-(0[1-9]|1[0-2])$/.test(date);
          if (valid && date >= model.start && date <= model.end) add('danger','batch-affected',modelKeys,'recall');
          else if (valid) add('info','batch-not-listed',modelKeys,'recall');
          else add('caution','batch-date-needed',modelKeys,'recall');
          break;
        }
        case 'seller-us-amazon': {
          if (input.purchaseChannel === 'amazon-us') add('danger','seller-us-affected',modelKeys,'recall');
          else if (input.purchaseChannel === 'other') add('caution','seller-us-other',modelKeys,'recall');
          else add('caution','seller-us-check',modelKeys,'recall');
          break;
        }
        case 'no-date-code': {
          if (input.noDateCode === 'yes' && input.sellerMitrytech === 'yes') add('danger','unit-recalled',modelKeys,'recall');
          else if (input.noDateCode === 'no' || input.sellerMitrytech === 'no') add('info','condition-not-listed',modelKeys,'recall');
          else add('caution','check-seller-code',modelKeys,'recall');
          break;
        }
        default: add('caution','recall-check',modelKeys,'recall');
      }
    }
  } else if (normalize(input.modelText)) add('caution','model-untracked',[],'recall');
  else add('caution','model-missing',[],'recall');

  if (airline && model && (airline.bannedModels || []).includes(model.id)) add('danger','airline-model-ban',[sourceKey],'flight');
  else if (airline?.banRecalled && model?.issue === 'recall') {
    if (reasons.some(r => modelDanger.has(r.code))) add('danger','airline-recalled-ban',[sourceKey],'flight');
    else add('caution','airline-recall-check',[sourceKey],'flight');
  }

  if (meaningful(input.whInput) && typedWh === null) add('caution','wh-invalid',[],'flight');
  if ((meaningful(input.mah) || meaningful(input.volts)) && computedWh === null) add('caution','mah-invalid',[],'flight');
  if (whConflict) {
    add('caution', 'wh-conflict', [...new Set([...(model?.sources || []), 'icao'])],'flight');
  } else if (wh != null) {
    if (wh > 160) add('danger','wh-above-160',['icao','faa'],'flight');
    else if (airline?.maxWh != null) {
      const exceeds = airline.maxExclusive ? wh >= airline.maxWh : wh > airline.maxWh;
      if (exceeds && airline.large === 'approval' && wh <= 160 && wh > 100) add('caution','airline-approval-required',[sourceKey],'flight');
      else if (exceeds) add('danger','airline-wh-exceeded',[sourceKey],'flight');
      else if (wh > 100 && airline.large === 'approval') add('caution','airline-approval-required',[sourceKey],'flight');
      else add('info','wh-within-stated-limit',[sourceKey],'flight');
    } else if (wh > 100) add('caution','over100-airline-unknown',['icao','faa'],'flight');
    else add('info','wh-icao-reference',['icao'],'flight');
  } else add('caution','wh-unverified',['icao'],'flight');

  if (quantity === null) add('caution','quantity-invalid',['icao'],'flight');
  else if (quantity > 2 || (airline?.limit != null && quantity > airline.limit))
    add('danger','quantity-exceeds',airline?.limit != null ? [sourceKey,'icao'] : ['icao'],'flight');
  else add('info','quantity-checked',airline?.limit != null ? [sourceKey] : ['icao'],'flight');

  if (!airline) add('caution','airline-missing',['icao'],'flight');
  else if (airline.coverage !== 'full') add('caution','airline-partial',[sourceKey],'flight');

  const snapshot = new Date(`${registry.edition}T00:00:00Z`);
  const age = Math.max(0,Math.floor((now.getTime() - snapshot.getTime()) / 86400000));
  if (!Number.isFinite(snapshot.getTime()) || age > 30) add('caution','snapshot-stale',[],'flight',{age});
  reasons.sort((a,b)=>priority[b.level]-priority[a.level]);
  const breakdown = group => {
    const matching = reasons.filter(r=>r.group===group);
    const top = matching[0] || {level:'info',code:group==='recall'?'no-specific-recall':'wh-icao-reference'};
    return {level:top.level,code:top.code};
  };
  const primary = reasons[0] || {level:'caution',code:'model-missing'};
  const sourceKeys = [...new Set(reasons.flatMap(r=>r.sourceKeys || []).filter(Boolean))];
  return {model,airline,wh,whOrigin,officialWh,computedWh,quantity,whConflict,age,
    severity:primary.level,code:primary.code,reasons,sourceKeys,
    recall:breakdown('recall'),flight:breakdown('flight'),
    reviewNeeded:reasons.some(r=>r.level==='caution'),
    share:{model:model?.model || String(input.modelText || ''),airline:airline?.name || '',from,to,via}};
}
export function suggestions(query: any, models: any[] = [], max = 7) {
  const needle = normalize(query);
  if (needle.length < 2) return [];
  return models.map(m=>({m, weight:normalize(m.model) === needle ? 0 : normalize(m.model).startsWith(needle) ? 1 : normalize(m.brand+m.model).includes(needle) ? 2 : normalize(m.name).includes(needle) ? 3 : normalize(m.model).includes(needle) ? 4 : 99}))
    .filter(x=>x.weight<99).sort((a,b)=>a.weight-b.weight || a.m.model.localeCompare(b.m.model)).slice(0,max).map(x=>x.m);
}
