import { useState, useEffect } from "react";
import { SlArrowRight } from "react-icons/sl";

// eslint-disable-next-line react/prop-types
const Version = ({ terms }) => {
    const [, setEmailConfig] = useState(null);
    const [requestedVersions, setRequestedVersions] = useState(new Set());
    const [emailError, setEmailError] = useState(null);

    // Initialize email config on component mount
    useEffect(() => {
        // eslint-disable-next-line react/prop-types
        if (terms?.company_email) {
            // eslint-disable-next-line react/prop-types
            setEmailConfig(terms.company_email);
        }
    }, [terms]);

    const handleRequestVersion = (version) => {
        try {
            // eslint-disable-next-line react/prop-types
            if (!terms.company_email) {
                setEmailError("Email configuration is missing. Please contact support.");
                return;
            }

            if (requestedVersions.has(version)) {
                return;
            }

            // Construct email parameters
            // eslint-disable-next-line react/prop-types
            const recipient = terms.company_email;
            const subject = `Request for Version ${version}`;
            // eslint-disable-next-line react/prop-types
            const body = `I would like to request access to version ${version} of the ${terms.LegalTitle}.`;

            if (!recipient) {
                setEmailError("Email configuration is incomplete. Please contact support.");
                return;
            }

            setRequestedVersions(new Set([...requestedVersions, version]));

            const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;

        } catch (error) {
            console.error("Error handling version request:", error);
            setEmailError("Error opening email client. Please try again.");
        }
    };

    // eslint-disable-next-line react/prop-types
    if (!terms?.version || !Array.isArray(terms.version)) {
        return <div className="text-gray-500 p-4">No version history available.</div>;
    }

    // Create version objects with proper data structure
    // eslint-disable-next-line react/prop-types
    const versionData = terms.version.map((version, index) => ({
        version: version,
        // eslint-disable-next-line react/prop-types
        isLatest: Array.isArray(terms.isLatest) ? terms.isLatest[index] : false
    }));

    // Sort versions in descending order
    const sortedVersions = [...versionData].sort((a, b) => {
        return b.version.localeCompare(a.version, undefined, { numeric: true });
    });

    return (
        <div>
            {emailError && (
                <div className="max-w-3xl mx-auto mb-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {emailError}
                    </div>
                </div>
            )}
            
            <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg mb-10 mt-5">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Past Versions</h2>
                <div className="space-y-2">
                    {sortedVersions.map((item, index) => {
                        const isLatest = item.isLatest === true || item.isLatest === "true";
                        
                        return (
                            <div
                                key={`version-${index}`}
                                className={`flex items-center justify-between p-4 bg-white rounded-lg border ${
                                    !isLatest ? "hover:bg-gray-50" : "hover:bg-green-50"
                                } transition-all duration-200`}
                            >
                                <div className="flex items-center justify-between flex-1">
                                    <div className="flex items-center space-x-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Version {item.version}
                                        </h3>
                                        {isLatest && (
                                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                                                Latest
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => handleRequestVersion(item.version)}
                                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                                                requestedVersions.has(item.version)
                                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                                    : "bg-yellow-200 text-gray-700 hover:bg-yellow-100"
                                            }`}
                                            disabled={requestedVersions.has(item.version)}
                                        >
                                            {requestedVersions.has(item.version) 
                                                ? "Requested" 
                                                : "Request via Email"}
                                        </button>
                                        <SlArrowRight className="w-5 h-5 text-gray-600" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Version;