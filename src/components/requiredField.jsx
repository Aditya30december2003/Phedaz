// components/RequiredLabel.jsx
// eslint-disable-next-line react/prop-types
const RequiredLabel = ({ label, required }) => (
    <label className="block font-medium mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  
  export default RequiredLabel;
  