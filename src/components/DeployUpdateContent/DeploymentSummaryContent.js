import React, { useState } from 'react';
import styles from './DeploymentSummaryContent.module.css';

const policyLabels = {
  modelName: 'Model Name',
  serialNumber: 'Serial Number',
  manufactureDate: 'Manufacture Date',
  optionType: 'Option Type',
};

const DeploymentSummary = ({ deploymentData, onDeployClick }) => {
  const { uploadedFileName, updateName, price, description, policyConditions } = deploymentData || {};
  const validPolicyConditions = policyConditions && typeof policyConditions === 'object';
  const [skipDetails, setSkipDetails] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleCheckboxChange = (event) => {
    setSkipDetails(event.target.checked);
  };

  const handleDeployButtonClick = () => {
    if (onDeployClick) {
      console.log("DeploymentSummaryContent: Deploy button clicked, skipDetails:", skipDetails);
      setIsDeploying(true);
      onDeployClick(skipDetails, () => setIsDeploying(false));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Update File Info</h2>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>File Name:</span>
            <span className={styles.infoValue}>{uploadedFileName || 'N/A'}</span>
          </div>
        </div>
        <div className={styles.dividingLine}></div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Update Details</h2>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Update Name:</span>
            <span className={styles.infoValue}>{updateName || 'N/A'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Price:</span>
            <span className={styles.infoValue}>{price ? `${price} ETH` : 'N/A'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Description:</span>
            <div className={styles.descriptionValue}>{description || 'N/A'}</div>
          </div>
        </div>
        <div className={styles.dividingLine}></div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Policy Conditions</h2>
          {validPolicyConditions ? (
            <div className={styles.policyConditions}>
              {Object.keys(policyConditions).map(typeKey => (
                <div key={typeKey} className={styles.policyType}>
                  <span className={styles.policyLabel}>
                    {policyLabels[typeKey] || typeKey}
                  </span>
                  <span className={styles.policySeparator}>:</span>
                  <div className={styles.policyValues}>
                    {policyConditions[typeKey] && policyConditions[typeKey].length > 0 ? (
                      policyConditions[typeKey].map((value, index) => (
                        <span key={index} className={styles.policyValueItem}>
                          {value || 'N/A'}
                          {index < policyConditions[typeKey].length - 1 && ', '}
                        </span>
                      ))
                    ) : (
                      <span className={styles.policyValueItem}>N/A</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.policyConditions}>N/A</div>
          )}
        </div>
      </div>
      <div className={styles.rightColumn}>
        {isDeploying ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <div className={styles.loadingText}>Deployment in progress...</div>
          </div>
        ) : (
          <div className={styles.buttonContainer}>
            <button className={styles.deployButton} onClick={handleDeployButtonClick}>
              Deploy
            </button>
            <div>*Warning: This action cannot be undone! Please choose carefully!</div>
            <div className={styles.skipDetails}>
              <input
                type="checkbox"
                id="skipDetailsCheckbox"
                checked={skipDetails}
                onChange={handleCheckboxChange}
                className={styles.skipCheckbox}
              />
              <label htmlFor="skipDetailsCheckbox" className={styles.skipLabel}>
                Skip explanation
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentSummary;