import { Annoyed, Smile, SmilePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { auth } from "../../../Firebase/Firebase";

const Feedback = () => {
  const navigate = useNavigate();
  const [email,setEmail]=useState("")
  const user=auth.currentUser
  //current email
useEffect(() => {
  if (user && user.email) {
    setData((prev) => ({
      ...prev,
      email: user.email 
    }));
  }
}, [user]);
  
  const [data, setData] = useState({
    email:"",
    emoji: "",
    number: "",
    text: "",
    message: ""
  });

  const handleFeedback = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    
    if (!data.emoji || !data.number || !data.text) {
      return Swal.fire({
        title: "Unfilled formed!",
        text: "Please fill the form!",
        icon: "warning",
        confirmButtonColor: "#FF6347"
      });
    }

    const formData = new FormData();
    formData.append("access_key", "c586bfa8-e5bc-4ca5-bbb7-3f17ac859726");
    formData.append("Fired Email", data.email);
    formData.append("emoji_feedback", data.emoji);
    formData.append("rating_number", data.number);
    formData.append("best_feature", data.text);
    formData.append("message", data.message);

    if(email){
      
      try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        Swal.fire({
          title: "Thanks you!",
          text: "Feedback has been sent successfully!",
          icon: "success",
          confirmButtonColor: "#FF6347", 
        });
        
        setData({ emoji: "", number: "", text: "", message: "" });
        navigate("/");
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error to submit Mail");
    }
    }
  };

  return (
    <div className="w-full mx-auto md:p-6 min-h-screen flex items-center">
      <form
        onSubmit={submitHandler}
        className="shadow-lg border border-gray-100 md:min-w-2xl mx-auto rounded-2xl p-8 flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">Feedback</h2>

        {/* Emoji Section */}
        <div>
          <h2 className="font-semibold mb-3">Give your rating for our Service?</h2>
          <div className="flex flex-row items-center gap-6">
            <button 
              type="button" 
              onClick={() => handleFeedback("emoji", "bad")}
              className={`p-2 rounded-full transition-all duration-300 ${data.emoji === 'bad' ? "bg-red-100 scale-110" : "hover:bg-gray-100"}`}
            >
              <Annoyed size={50} strokeWidth={1.5} color={data.emoji === 'bad' ? "#FF6347" : "#666"} />
            </button>

            <button 
              type="button" 
              onClick={() => handleFeedback("emoji", "good")}
              className={`p-2 rounded-full transition-all duration-300 ${data.emoji === 'good' ? "bg-green-100 scale-110" : "hover:bg-gray-100"}`}
            >
              <Smile size={50} strokeWidth={1.5} color={data.emoji === 'good' ? "#10B981" : "#666"} />
            </button>

            <button 
              type="button" 
              onClick={() => handleFeedback("emoji", "excellent")}
              className={`p-2 rounded-full transition-all duration-300 ${data.emoji === 'excellent' ? "bg-yellow-100 scale-110" : "hover:bg-gray-100"}`}
            >
              <SmilePlus size={50} strokeWidth={1.5} color={data.emoji === 'excellent' ? "#F59E0B" : "#666"} />
            </button>
          </div>
        </div>

        {/* Rating Number Section */}
        <div>
          <h2 className="font-semibold mb-3">Give a rating number(1-5):</h2>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleFeedback("number", num.toString())}
                className={`w-12 h-12 flex items-center justify-center rounded-full font-bold transition-all ${
                  data.number === num.toString() 
                  ? "bg-[#FF6347] text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Best Feature Section */}
        <div className="space-y-2">
          <h2 className="font-semibold mb-1">What is your favourite Feature?</h2>
          {[
            { id: "check1", val: "Advanced Search Functionality" },
            { id: "check2", val: "Customizable Settings" },
            { id: "check3", val: "User-friendly Interface" }
          ].map((feature) => (
            <div key={feature.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100">
              <input 
                type="radio" 
                name="featureSelection" 
                id={feature.id} 
                value={feature.val} 
                className="accent-[#FF6347] w-4 h-4"
                onChange={(e) => handleFeedback("text", e.target.value)}
              />
              <label htmlFor={feature.id} className="cursor-pointer text-gray-700">{feature.val}</label>
            </div>
          ))}
        </div>

        {/* Message Section */}
        <div>
          <h2 className="font-semibold mb-2">Please enter your message</h2>
          <textarea
            name="message"
            placeholder="Enter your whole message body"
            value={data.message}
            onChange={(e) => handleFeedback("message", e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-200 outline-none rounded-lg focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347] transition-all"
          ></textarea>
        </div>

        <button 
          className="w-full bg-[#FF6347] hover:bg-[#e55940] text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-95 transition-all" 
          type="submit"
        >
          Send Feedback!
        </button>
      </form>
    </div>
  );
};

export default Feedback;