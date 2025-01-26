import { useState} from "react";
import { SlArrowRight } from "react-icons/sl";

const Version = ({ terms }) => {
    const [emailConfig, setEmailConfig] = useState(null); 
    const [requestedVersions, setRequestedVersions] = useState(new Set());
    const [emailError, setEmailError] = useState(null);

    const handleRequestVersion = (version) => {
        console.log("Button clicked for version:", version);

        if (!emailConfig) {
            console.error("No email config available.");
            setEmailError("Email configuration is missing. Please contact support.");
            return; 
        }

        if (requestedVersions.has(version)) {
            console.log(`Version ${version} already requested.`);
            return;
        }

        setRequestedVersions(new Set([...requestedVersions, version]));

        const recipient = emailConfig.recipient;
        const subject = emailConfig.subject + version;
        let body = emailConfig.body;
        body += version;

        if (!recipient || !subject || !body) {
            console.error("Incomplete email configuration:", emailConfig);
            setEmailError("Incomplete email configuration. Please contact support.");
            return;
        }

        const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        console.log("Generated mailto URL:", mailtoUrl);

        try {
            window.location.href = mailtoUrl;
        } catch (error) {
            console.error("Error opening mailto:", error);
            setEmailError("Error opening email client.");
        }
    };
    if (emailError) {
        return <div className="text-red-500 p-4">{emailError}</div>;
    }

    return (
        <div>
            <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg mb-10 mt-5">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Past Versions</h2>
                <div className="space-y-2">
                    {terms.version.map((item) => {
                        const isLatest = item.isLatest === true || item.isLatest === "true"; // Ensure `isLatest` is a boolean

                        return (
                            <div
                                key={item.$id}
                                className={`flex items-center justify-between p-4 bg-white rounded-lg border ${
                                    !isLatest ? "bg-gray-50" : "hover:bg-gray-50"
                                } transition-all duration-200`}
                            >
                                <div className="flex items-center justify-between flex-1">
                                    <div className="flex items-center space-x-4">
                                        <h3
                                            className={`text-lg font-medium ${
                                                !isLatest ? "text-gray-500" : "text-gray-900"
                                            }`}
                                        >
                                            Version {item}
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
                                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed" // Disable if requested
                                                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                            }`}
                                            disabled={requestedVersions.has(item.version)} // Disable the button
                                        >
                                            {requestedVersions.has(item.version) ? "Requested" : "Request via Email"}{" "}
                                            {/* Change button text */}
                                        </button>
                                        <SlArrowRight
                                            className={`w-5 h-5 ${
                                                !isLatest ? "text-gray-400" : "text-gray-600"
                                            }`}
                                        />
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

