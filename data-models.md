# Sweet Deal Decision Engine — Data Models
## CEF Document v1.0 | Reference: data-models.md

---

## Overview

All data for MVP is stored in **browser localStorage** as JSON objects.
No database or backend needed for the first version.

Storage keys follow this pattern: `lpg_{entity}_{id}`

---

## ENTITY 1: TargetMarket
*Output of Module 1 — Market Finder*

```json
{
  "id": "mkt_001",
  "created_at": "2026-03-25T10:00:00Z",
  "state": "Texas",
  "metro_area": "San Antonio",
  "target_counties": [
    {
      "county_name": "Medina County",
      "state": "TX",
      "growth_score": 8.5,
      "why_recommended": "Located 30 miles west of San Antonio, strong population spillover, low land prices",
      "property_types_best_for": ["outskirts_1_10_ac", "rural_10_100_ac"],
      "assessor_website": "https://www.medinaappraisal.com",
      "notes": ""
    }
  ],
  "property_type_preference": "outskirts_1_10_ac",
  "status": "active"
}
```

**Property Type Options:**
- `infill_lots` — Inside metro area, for builders
- `outskirts_1_10_ac` — 1-10 acres outside metro, path of growth
- `rural_10_100_ac` — Rural recreational, 1-3 hours from city

---

## ENTITY 2: PropertyList
*Output of Module 2 — List Upload*

```json
{
  "id": "list_001",
  "created_at": "2026-03-25T10:05:00Z",
  "county_name": "Medina County",
  "state": "TX",
  "source": "County Assessor Download",
  "total_records": 4820,
  "column_mapping": {
    "parcel_id": "APN",
    "owner_name": "Owner Name",
    "owner_address": "Mailing Address",
    "owner_city": "Mailing City",
    "owner_state": "Mailing State",
    "property_address": "Situs Address",
    "acres": "Land Size (AC)",
    "assessed_value": "Total Assessed Value",
    "zoning": "Zoning Code",
    "tax_status": "Tax Current"
  },
  "raw_data_key": "lpg_rawdata_list_001"
}
```

**Note:** Raw CSV data is stored separately under `raw_data_key` to keep this object small.

---

## ENTITY 3: FilteredList
*Output of Module 3 — Smart List Filter*

```json
{
  "id": "filtered_001",
  "created_at": "2026-03-25T10:15:00Z",
  "source_list_id": "list_001",
  "filters_applied": {
    "min_acres": 1,
    "max_acres": 10,
    "owner_out_of_state": true,
    "owner_is_individual": true,
    "min_assessed_value": 5000,
    "max_assessed_value": 100000,
    "tax_status": "any",
    "zoning_codes": ["VL", "AG", "RES-VAC"]
  },
  "original_count": 4820,
  "filtered_count": 312,
  "removed_breakdown": {
    "wrong_size": 2100,
    "in_state_owner": 800,
    "company_owned": 450,
    "out_of_value_range": 158
  },
  "filtered_data_key": "lpg_filtered_filtered_001"
}
```

---

## ENTITY 4: Deal
*Core entity — tracks one property through the entire pipeline*

```json
{
  "id": "deal_001",
  "created_at": "2026-03-25T11:00:00Z",
  "updated_at": "2026-03-25T11:00:00Z",
  
  "property": {
    "parcel_id": "123-456-789",
    "address": "0 Ranch Road 471, Hondo TX 78861",
    "county": "Medina County",
    "state": "TX",
    "acres": 3.5,
    "zoning": "AG",
    "assessed_value": 21000,
    "estimated_market_value": 28000
  },

  "owner": {
    "name": "James R. Hartley",
    "mailing_address": "4521 Oak Bluff Dr",
    "city": "Tucson",
    "state": "AZ",
    "zip": "85710",
    "phone": "",
    "email": ""
  },

  "offer": {
    "min_offer": 1400,
    "max_offer": 7000,
    "sweet_spot_offer": 2800,
    "locked_offer": 2800,
    "offer_pct_of_market": 0.10
  },

  "pipeline_stage": "letter_sent",
  "letter_type": "blind_offer",
  "letter_sent_date": "2026-03-26",

  "selling_strategy": "seller_financing",

  "buy_details": {
    "actual_purchase_price": 2800,
    "closing_cost": 150,
    "total_cost": 2950,
    "purchase_date": null
  },

  "sell_details": {
    "asking_price": 25000,
    "sale_price": null,
    "sale_date": null,
    "profit": null
  },

  "seller_financing_terms": {
    "down_payment_pct": 0.15,
    "down_payment_amount": 3750,
    "loan_amount": 21250,
    "interest_rate": 0.10,
    "term_years": 10,
    "monthly_payment": 280.82,
    "total_collected": 37498.40,
    "total_profit": 34548.40
  },

  "notes": "Owner inherited this from father. Has been paying taxes but says he lives in AZ and has never visited.",
  "status": "active"
}
```

**Pipeline Stage Options (in order):**
1. `new_lead`
2. `letter_sent`
3. `seller_responded`
4. `negotiating`
5. `under_contract`
6. `closed_bought`
7. `for_sale`
8. `sold`
9. `dead` — did not work out

---

## ENTITY 5: Letter
*Output of Module 5 — Letter Generator*

```json
{
  "id": "letter_001",
  "created_at": "2026-03-25T11:30:00Z",
  "deal_id": "deal_001",
  "letter_type": "blind_offer",
  "from_name": "Nestor Garcia",
  "from_company": "NG Land Partners",
  "from_address": "8190 W Deer Valley Rd Suite 271, Phoenix AZ 85027",
  "from_phone": "(602) 555-0192",
  "offer_price": 2800,
  "body_text": "[Full letter text stored here]",
  "status": "draft",
  "printed": false,
  "mailed_date": null
}
```

---

## ENTITY 6: ProfitCalculation
*Output of Module 7 — Profit Calculators*

```json
{
  "id": "calc_001",
  "created_at": "2026-03-25T12:00:00Z",
  "deal_id": "deal_001",
  "calc_type": "seller_financing",

  "wholesale_calc": {
    "buy_price": 2800,
    "sell_price": 14000,
    "closing_costs": 300,
    "profit": 10900,
    "roi_pct": 3.89,
    "time_to_sell_estimate_days": 14
  },

  "seller_financing_calc": {
    "buy_price": 2800,
    "asking_price": 25000,
    "down_payment": 3750,
    "loan_amount": 21250,
    "interest_rate_pct": 10,
    "term_years": 10,
    "monthly_payment": 280.82,
    "total_interest_collected": 12498.40,
    "total_received": 37498.40,
    "total_profit": 34698.40,
    "break_even_month": 12,
    "annualized_return_pct": 124
  }
}
```

---

## ENTITY 7: UserProfile
*Stores user's business info for letter generation*

```json
{
  "id": "user_profile",
  "your_name": "Nestor Garcia",
  "company_name": "NG Land Partners",
  "mailing_address": "8190 W Deer Valley Rd Suite 271",
  "city": "Phoenix",
  "state": "AZ",
  "zip": "85027",
  "phone": "(602) 555-0192",
  "email": "nestor@nglandpartners.com",
  "website": "",
  "default_offer_pct": 0.10,
  "default_letter_type": "blind_offer",
  "default_interest_rate": 0.10,
  "default_loan_term_years": 10
}
```

---

## localStorage Key Map

| Data Type | localStorage Key Pattern |
|-----------|--------------------------|
| User Profile | `lpg_user_profile` |
| All Deal IDs | `lpg_deals_index` |
| Individual Deal | `lpg_deal_{id}` |
| All Market IDs | `lpg_markets_index` |
| Individual Market | `lpg_market_{id}` |
| Raw CSV Data | `lpg_rawdata_{list_id}` |
| Filtered Data | `lpg_filtered_{filtered_id}` |
| Letters | `lpg_letter_{id}` |
| Calculations | `lpg_calc_{id}` |
| App Settings | `lpg_settings` |

---

*Document Version: 1.0 | Sweet Deal Decision Engine Project*
