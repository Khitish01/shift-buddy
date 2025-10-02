'use client';
import { useEffect, useState } from 'react';
import { ValidatedInput } from '../ui/ValidatedInput';
import { fieldSchemas } from '@/lib/validationSchemas';
import { PolicyQABlock } from './FaqEditor';
import { apiCall } from '@/lib/apiCall';
import { adminClient } from '@/lib/apiClient';
import { useTopLoader } from '@/context/TopLoader';
import { usePopup } from '@/context/PopupContext';

export const SettingsComponent = () => {
    const [activeTab, setActiveTab] = useState('Privacy Policy');
    const [policyData, setPolicyData] = useState<any>(null);
    const loader = useTopLoader();
    const { showPopup, updatePopupStatus } = usePopup();

    const getData = async () => {
        loader.showLoader();
        try {
            const res = await apiCall<any>(adminClient, 'GET', '/policy/v1/get_policy');
            setPolicyData(res.data);
        } catch (error) {
            console.log(error);
        }
        loader.hideLoader();
    }

    useEffect(() => {
        getData()
    }, [])

    const updateData = async () => {
        console.log(policyData);

        showPopup(`${activeTab} updating`, `${activeTab} update in progress...`);

        try {
            const res = await apiCall<any>(adminClient, 'POST', '/policy/v1/add_policy', policyData);
            setPolicyData(res.data);
            updatePopupStatus('success', `${activeTab} updated`, `${activeTab} updated successfully`, 4000);
        } catch (error) {
            console.log(error);
            updatePopupStatus('error', 'Something went wrong', `Failed to update ${activeTab}`);
        }

        // if (!policyData) return;
    }

    const getCurrentContent = () => {
        if (!policyData) return '';
        switch (activeTab) {
            case 'Privacy Policy':
                return policyData.privacyPolicy || '';
            case 'Terms & Conditions':
                return policyData.termsAndCondition || '';
            case 'Incident Form':
                return policyData.incidentForm || '';
            default:
                return '';
        }
    };

    const handleContentChange = async (value: any) => {
        console.log(value);

        if (!policyData) return;
        const updatedData = { ...policyData };
        switch (activeTab) {
            case 'Privacy Policy':
                updatedData.privacyPolicy = value;
                break;
            case 'Terms & Conditions':
                updatedData.termsAndCondition = value;
                break;
            case 'Incident Form':
                updatedData.incidentForm = value;
                break;
            case 'FAQ':
                updatedData.faq = value;
                break;
        }
        setPolicyData(updatedData);
    };
    const tabs = ['Privacy Policy', 'Terms & Conditions', 'FAQ', 'Incident Form'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Privacy Policy':
            case 'Terms & Conditions':
            case 'Incident Form':
                return (
                    <div className="space-y-6">
                        {/* <div>
                            <ValidatedInput
                                label="Policy Name"
                                value={policyName}
                                placeholder=""
                                onChange={(val) =>
                                    setPolicyName(val)
                                }
                                schema={fieldSchemas["personalInfo.name"]}
                                path="personalInfo.name"
                            />
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Policy Description
                            </label>
                            <textarea
                                value={getCurrentContent()}
                                onChange={(e) => handleContentChange(e.target.value)}
                                rows={12}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button onClick={updateData} className="bg-[#69417E] text-white px-8 py-2 rounded-md hover:bg-purple-700 transition-colors">
                                {activeTab === 'Privacy Policy' || activeTab === 'Terms & Conditions' ? 'Update' : 'ADD'}
                            </button>
                        </div>
                    </div>
                );
            case 'FAQ':
                return <PolicyQABlock
                    faqData={policyData?.faq || []}
                    onChanges={async (data) => {
                        const updatedData = { ...policyData, faq: data };
                        setPolicyData(updatedData);
                        await apiCall<any>(adminClient, 'POST', '/policy/v1/add_policy', updatedData);
                    }}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Policy</h1>
            <p className="text-gray-600 mb-8">
                Welcome To ensure a safe and respectful environment for all users, we have established the following Upload Policy. By uploading content to our platform, you agree to comply with these terms
            </p>

            <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                                ? 'border-[#69417E] text-[#69417E]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {renderContent()}
        </div>
    );
};