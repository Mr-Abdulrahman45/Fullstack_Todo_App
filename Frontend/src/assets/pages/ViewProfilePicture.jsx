import { useNavigate, useLocation } from "react-router-dom";

export default function ViewProfilePicture() {
const navigate = useNavigate();
const location = useLocation();
const pictureUrl = location.state?.pictureUrl;

if (!pictureUrl) {
return ( <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center"> <h1 className="text-2xl font-bold">No Profile Picture</h1>
<button
onClick={() => navigate(-1)}
className="mt-4 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
>
Go Back </button> </div>
);
}

return ( <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
<button
onClick={() => navigate(-1)}
className="self-start mb-6 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
>
← Back </button>


  <img
    src={pictureUrl}
    alt="Profile"
    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
  />

  <p className="mt-4 text-gray-400">Profile Picture</p>
</div>


);
}
