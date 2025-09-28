import { Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import FileUploadPage from './pages/FileUpload';
import UpdateSettingPage from './pages/UpdateSetting';
import AccessPolicyPage from './pages/AccessPolicy';
import DeploymentSummaryPage from './pages/DeploymentSummary';
import DeploymentCompletePage from './pages/DeploymentComplete';
import UpdateMonitoringPage from './pages/UpdateMonitoring';
import EncryptionVisualizationScene from './components/EncryptionVisualizationContent/EncryptionVisualizationScene'

function AboutRedirect() {

  useEffect(() => {
    window.location.href = 'https://github.com/HSU-Blocker';
  }, []);

  return null;
}

function App() {
  const navigate = useNavigate();
  const [deploymentData, setDeploymentData] = useState({
    uploadedFileName: null,
    uploadedFile: null,
    updateName: '',
    price: '',
    description: '',
    policyConditions: {
      modelName: ["VS500"],
      serialNumber: ["KMHEM42APXA75****"],
      manufactureDate: ["2015"],
      optionType: ["EXCLUSIVE", "PRESTIGE"],
    },
  });

  const handleFileSelected = useCallback((file) => {
    console.log("App.js: File selected:", file);
    setDeploymentData(prevData => ({
      ...prevData,
      uploadedFileName: file ? file.name : null,
      uploadedFile: file,
    }));
  }, []);

  const handleUpdateSettingsChange = useCallback((settings) => {
    console.log("App.js: Update settings changed:", settings);
    setDeploymentData(prevData => ({
      ...prevData,
      updateName: settings.updateName,
      price: settings.price,
      description: settings.description,
    }));
  }, []);

  const handlePolicyConditionsChange = useCallback((conditions) => {
    console.log("App.js: Policy conditions changed:", conditions);
    setDeploymentData(prevData => ({
      ...prevData,
      policyConditions: conditions,
    }));
  }, []);

  const handleDeploy = useCallback(async (skipDetails, setIsDeploying) => {

            // navigate('/encryption-visualization');

    console.log("App.js: Deploy button clicked with final data:", deploymentData);
    console.log("Skip Details:", skipDetails);
    console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);

    if (!deploymentData.uploadedFile) {
      alert('No file uploaded.');
      setIsDeploying(false);
      return;
    }
    if (!deploymentData.updateName) {
      alert('Version name is required.');
      setIsDeploying(false);
      return;
    }
    if (!deploymentData.description) {
      alert('Description is required.');
      setIsDeploying(false);
      return;
    }
    if (!deploymentData.price) {
      alert('Price is required.');
      setIsDeploying(false);
      return;
    }

    const policy = {
      model: deploymentData.policyConditions.modelName.length > 0 ? deploymentData.policyConditions.modelName.join(' OR ') : '',
      serial: deploymentData.policyConditions.serialNumber.length > 0 ? deploymentData.policyConditions.serialNumber.join(' OR ') : '',
      date: deploymentData.policyConditions.manufactureDate.length > 0 ? deploymentData.policyConditions.manufactureDate.join(' OR ') : '',
      option: deploymentData.policyConditions.optionType.length > 0 ? deploymentData.policyConditions.optionType.join(' OR ') : '',
    };
    const policyString = JSON.stringify(policy);

    console.log("Request Data:", {
      file: {
        name: deploymentData.uploadedFile?.name,
        type: deploymentData.uploadedFile?.type,
        size: deploymentData.uploadedFile?.size,
      },
      version: deploymentData.updateName,
      description: deploymentData.description,
      price: deploymentData.price,
      policy: policy,
    });

    try {
      const formData = new FormData();
      formData.append('file', deploymentData.uploadedFile);
      formData.append('version', deploymentData.updateName);
      formData.append('description', deploymentData.description);
      formData.append('price', deploymentData.price);
      formData.append('policy', policyString);

      console.log("FormData Contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(`${apiBaseUrl}/api/manufacturer/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'accept': 'application/json',
        },
      });

      console.log('Deployment successful:', response.data);
      // alert('Deployment completed!');
      setIsDeploying(false);

      setDeploymentData({
        uploadedFileName: null,
        uploadedFile: null,
        updateName: '',
        price: '',
        description: '',
        policyConditions: {
          modelName: [],
          serialNumber: [],
          manufactureDate: [],
          optionType: [],
        },
      });

      // Navigate to a different path depending on the skipDetails value
      if (skipDetails) {
        navigate('/complete');
      } else {
        navigate('/encryption-visualization', { state: { from: 'deployment' } });
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      console.log('Server error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`An error occurred during deployment: ${errorMessage}`);
      setIsDeploying(false);
    }
   }, [deploymentData, navigate]);

  return (
    <div className="app-root">
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutRedirect />} />
          <Route path="/monitoring" element={<UpdateMonitoringPage />} />
          <Route
            path="/upload"
            element={<FileUploadPage onFileSelected={handleFileSelected} uploadedFileName={deploymentData.uploadedFileName} />}
          />
          <Route
            path="/setting"
            element={<UpdateSettingPage
              onUpdateSettingsChange={handleUpdateSettingsChange}
              updateName={deploymentData.updateName}
              price={deploymentData.price}
              description={deploymentData.description}
            />}
          />
          <Route
            path="/access"
            element={<AccessPolicyPage onPolicyConditionsChange={handlePolicyConditionsChange} policyConditions={deploymentData.policyConditions} />}
          />
          <Route
            path="/summary"
            element={<DeploymentSummaryPage deploymentData={deploymentData} onDeployConfirm={handleDeploy} />}
          />
          <Route path="/complete" element={<DeploymentCompletePage />} />
          <Route 
            path="/encryption-visualization" 
            element={<EncryptionVisualizationScene />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;