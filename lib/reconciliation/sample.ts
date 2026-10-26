// Fictional September data, deliberately including a combined receipt, amount
// typo, bank fee, duplicate bank line and a possible uncleared cashbook entry.
export const sampleBankCsv = `Date,Description,Reference,Amount
2026-09-01,Oak Studio,REF100,1500.00
2026-09-02,Supplier payment,PAY200,-400.00
2026-09-04,Incoming transfer,,750.00
2026-09-08,Customer batch,BATCH8,600.00
2026-09-14,Pine Trading,PINE14,1250.00
2026-09-20,Monthly bank fee,FEE20,-10.00
2026-09-22,Office payment,OFF22,-90.00
2026-09-22,Office payment,OFF22,-90.00
2026-09-30,Software subscription,SUB30,-30.00`;

export const sampleLedgerCsv = `Date,Description,Reference,Debit,Credit
01/09/2026,Oak Studio,REF100,1500.00,
03/09/2026,Supplier payment,PAY200,,400.00
05/09/2026,Customer payment,INV55,750.00,
07/09/2026,Customer invoice 1,INV1,100.00,
07/09/2026,Customer invoice 2,INV2,200.00,
07/09/2026,Customer invoice 3,INV3,300.00,
14/09/2026,Pine Trading,PINE14,1520.00,
22/09/2026,Office payment,OFF22,,90.00
29/09/2026,Cheque issued,CHQ29,,275.00
30/09/2026,Software subscription,SUB30,,30.00`;
