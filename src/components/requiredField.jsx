// components/RequiredLabel.jsx
const RequiredLabel = ({ label, required }) => (
    <label className="block font-medium mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  
  export default RequiredLabel;
  