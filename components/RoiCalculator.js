'use client';

import { useState, useId } from 'react';
import Link from 'next/link';

function formatAED(num) {
  if (isNaN(num) || num === null) return 'AED 0';
  return 'AED ' + Math.round(num).toLocaleString('en-US');
}

export default function RoiCalculator({ defaults = {} }) {
  const priceInputId = useId();
  const areaInputId = useId();
  const yieldInputId = useId();
  const serviceChargeInputId = useId();

  const [price, setPrice] = useState(defaults.defaultPrice || 2500000);
  const [propType, setPropType] = useState(defaults.defaultType || 'off-plan'); // 'off-plan' | 'secondary'
  const [grossYield, setGrossYield] = useState(defaults.defaultRentalYield || 7.5);
  const [areaSqFt, setAreaSqFt] = useState(defaults.defaultAreaSqFt || 1050);
  const [serviceChargeRate, setServiceChargeRate] = useState(defaults.defaultServiceChargeSqFt || 16);

  // Statutory Fees Calculation
  const dldFee = price * 0.04;
  const dldAdminFee = propType === 'off-plan' ? 580 : 4200;
  const trusteeFee = propType === 'off-plan' ? 0 : price >= 500000 ? 4200 : 2100;
  const agencyFee = propType === 'off-plan' ? 0 : price * 0.02 * 1.05; // 2% + 5% VAT
  const totalFees = dldFee + dldAdminFee + trusteeFee + agencyFee;
  const totalAcquisitionCost = price + totalFees;

  // Rental Yield Calculation
  const annualGrossRent = price * (grossYield / 100);
  const annualServiceCharge = areaSqFt * serviceChargeRate;
  const annualNetRent = Math.max(0, annualGrossRent - annualServiceCharge);
  const netYield = price > 0 ? (annualNetRent / price) * 100 : 0;
  const monthlyNetIncome = annualNetRent / 12;

  // Golden Visa Calculation (AED 2,000,000 threshold)
  const isGoldenVisaEligible = price >= 2000000;
  const goldenVisaDeficit = 2000000 - price;

  return (
    <div className="roi-calculator-root">
      <div className="roi-calc-grid">
        {/* Left Inputs Column */}
        <div className="roi-calc-inputs">
          <div className="roi-calc-header">
            <h3>Investment Parameters</h3>
            <p>Customize asset valuation, transaction category, and yield targets.</p>
          </div>

          {/* Property Category Toggle */}
          <div className="roi-field-group">
            <label className="roi-field-label">Transaction Type</label>
            <div className="roi-toggle-group">
              <button
                type="button"
                className={`roi-toggle-btn ${propType === 'off-plan' ? 'active' : ''}`}
                onClick={() => setPropType('off-plan')}
              >
                <span>Direct Off-Plan</span>
                <span className="roi-toggle-sub">0% Buyer Commission</span>
              </button>
              <button
                type="button"
                className={`roi-toggle-btn ${propType === 'secondary' ? 'active' : ''}`}
                onClick={() => setPropType('secondary')}
              >
                <span>Secondary / Ready</span>
                <span className="roi-toggle-sub">2% Brokerage + Trustee</span>
              </button>
            </div>
          </div>

          {/* Property Price Input */}
          <div className="roi-field-group">
            <div className="roi-field-split">
              <label htmlFor={priceInputId} className="roi-field-label">
                Property Value (AED)
              </label>
              <span className="roi-field-val-display">{formatAED(price)}</span>
            </div>
            <input
              id={priceInputId}
              type="range"
              min="800000"
              max="20000000"
              step="50000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="roi-range-slider"
            />
            <div className="roi-slider-limits">
              <span>AED 800K</span>
              <span>AED 10M</span>
              <span>AED 20M+</span>
            </div>
          </div>

          {/* Expected Gross Rental Yield */}
          <div className="roi-field-group">
            <div className="roi-field-split">
              <label htmlFor={yieldInputId} className="roi-field-label">
                Projected Gross Yield (%)
              </label>
              <span className="roi-field-val-display">{grossYield.toFixed(1)}%</span>
            </div>
            <input
              id={yieldInputId}
              type="range"
              min="4.0"
              max="12.0"
              step="0.1"
              value={grossYield}
              onChange={(e) => setGrossYield(Number(e.target.value))}
              className="roi-range-slider"
            />
            <div className="roi-slider-limits">
              <span>4.0% (Conservative)</span>
              <span>7.5% (Dubai Average)</span>
              <span>12.0% (High Growth)</span>
            </div>
          </div>

          {/* Area & Service Charges Grid */}
          <div className="roi-fields-row">
            <div className="roi-field-half">
              <label htmlFor={areaInputId} className="roi-field-label">
                Property Size (sq.ft)
              </label>
              <input
                id={areaInputId}
                type="number"
                min="350"
                max="10000"
                step="50"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="roi-number-input"
              />
            </div>
            <div className="roi-field-half">
              <label htmlFor={serviceChargeInputId} className="roi-field-label">
                Service Charge (AED/sq.ft)
              </label>
              <input
                id={serviceChargeInputId}
                type="number"
                min="5"
                max="50"
                step="1"
                value={serviceChargeRate}
                onChange={(e) => setServiceChargeRate(Number(e.target.value))}
                className="roi-number-input"
              />
            </div>
          </div>
        </div>

        {/* Right Financial Telemetry Column */}
        <div className="roi-calc-results">
          {/* Golden Visa Status Callout */}
          <div className={`roi-visa-badge ${isGoldenVisaEligible ? 'visa-eligible' : 'visa-ineligible'}`}>
            <div className="roi-visa-icon">
              {isGoldenVisaEligible ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
            </div>
            <div>
              <strong>
                {isGoldenVisaEligible
                  ? 'Qualifies for UAE 10-Year Golden Visa'
                  : 'AED 2M Golden Visa Shortfall'}
              </strong>
              <p>
                {isGoldenVisaEligible
                  ? 'Eligible for long-term renewable 10-year residency with full family and domestic sponsorship.'
                  : `Increase acquisition value by ${formatAED(goldenVisaDeficit)} to unlock 10-Year Golden Visa residency.`}
              </p>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="roi-metrics-hero">
            <div className="roi-hero-metric-box">
              <span className="roi-metric-label">Estimated Net Yield</span>
              <span className="roi-metric-value yield-accent">{netYield.toFixed(2)}%</span>
              <span className="roi-metric-sub">After all service charges</span>
            </div>
            <div className="roi-hero-metric-box">
              <span className="roi-metric-label">Net Annual Rental</span>
              <span className="roi-metric-value">{formatAED(annualNetRent)}</span>
              <span className="roi-metric-sub">{formatAED(monthlyNetIncome)} / month</span>
            </div>
          </div>

          {/* Itemized Breakdown Table */}
          <div className="roi-breakdown-card">
            <h4>Acquisition & Statutory Fee Schedule</h4>

            <div className="roi-breakdown-row">
              <span>Agreed Property Price</span>
              <span>{formatAED(price)}</span>
            </div>
            <div className="roi-breakdown-row">
              <span>DLD Transfer Fee (4%)</span>
              <span>{formatAED(dldFee)}</span>
            </div>
            <div className="roi-breakdown-row">
              <span>DLD Administration / Oqood Fee</span>
              <span>{formatAED(dldAdminFee)}</span>
            </div>
            {propType === 'secondary' && (
              <>
                <div className="roi-breakdown-row">
                  <span>Trustee Registration Fee</span>
                  <span>{formatAED(trusteeFee)}</span>
                </div>
                <div className="roi-breakdown-row">
                  <span>Brokerage Fee (2% + 5% VAT)</span>
                  <span>{formatAED(agencyFee)}</span>
                </div>
              </>
            )}
            {propType === 'off-plan' && (
              <div className="roi-breakdown-row fee-waived">
                <span>Brokerage Commission</span>
                <span className="waived-pill">0% FREE TO BUYER</span>
              </div>
            )}

            <div className="roi-breakdown-total">
              <div>
                <span className="total-title">Total Capital Required</span>
                <span className="total-sub">Property Price + Statutory Fees</span>
              </div>
              <span className="total-figure">{formatAED(totalAcquisitionCost)}</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="roi-calc-actions">
            <Link
              href={`/contact?topic=pro-forma&budget=${price}&type=${propType}`}
              className="roi-action-btn"
            >
              Request Bespoke Institutional Pro-Forma &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
