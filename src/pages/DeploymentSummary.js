import React from 'react';
import HeaderContent from '../components/HeaderContent/HeaderContent';

import BackgroundContent from '../components/Background/BackgroundContent';
import DeploymentSummaryContent from '../components/DeployUpdateContent/DeploymentSummaryContent';
import { useNavigate } from 'react-router-dom';

function DeploymentSummary({ deploymentData, onDeployConfirm }) {
  const navigate = useNavigate();

  // const handleCubeClick = () => {
  //   navigate('/summary');
  // };

  const handleBackClick = () => {
    navigate('/access');
  };

  return (
    <div>
      <HeaderContent title="Deployment Summary" onBackClick={handleBackClick} />
      <BackgroundContent>
        <DeploymentSummaryContent deploymentData={deploymentData} onDeployClick={onDeployConfirm} />
      </BackgroundContent>
      {/* <ProgressFooterContent label="Deployment Summary" onClick={handleCubeClick} instructionText={""}/> */}
    </div>
  );
}

export default DeploymentSummary;