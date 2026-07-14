// Minimal shim used by EstimatePrintable / PublicEstimate.
// The full estimates admin hook lives in the FloorPro admin app; here we
// only need the line-item shape and totals helper.

export interface EstimateLineItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  unit_cost?: number;
  amount: number;
  category?: string;
  source_measurement_id?: string;
  source_area_ids?: string[];
  source_group_key?: string;
  source_qty_snapshot?: number;
  source_label?: string;
}

export function recalcTotals(items: EstimateLineItem[], discount = 0, tax = 0) {
  const subtotal = items.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const total = Math.max(0, subtotal - (Number(discount) || 0) + (Number(tax) || 0));
  return { subtotal, total };
}
