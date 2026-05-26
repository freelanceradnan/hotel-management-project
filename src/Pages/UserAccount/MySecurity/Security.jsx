import React, { useContext, useState } from "react";

import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updateEmail,
} from "firebase/auth";

import {
  ChevronDown,
  ChevronRight,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { auth, db } from "../../../Firebase/Firebase";

import { toast } from "react-toastify";

import { deleteDoc, doc } from "firebase/firestore";

import { useNavigate } from "react-router";
import { StoreContext } from "../../../Contexts/StoreContext";
import { useUpdateSeparateUserDataMutation } from "../../../Feature/ApiSlice";
// import { useUpdateSeparateUserDataMutation } from "../../../Feature/ApiSlice";


const Security = () => {
  const user = auth.currentUser;
  const {currentUser}=useContext(StoreContext)
  const userId=currentUser?.uid
  const navigate = useNavigate()

  const [emailModal, setEmailModal] = useState(false);
  const [passModal, setPassModal] = useState(false);

  const [editEmail, setEditEmail] = useState(false);
  const [editPass, setEditPass] = useState(false);

  const [emailStep, setEmailStep] = useState(1);
  const [passwordStep, setPasswordStep] = useState(1);

  const [currentPassword, setCurrentPassword] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetLoading, setResetLoading] = useState(false);
  const [updateUser]=useUpdateSeparateUserDataMutation()
  const verifyEmailPassword = async (e) => {
    e.preventDefault();

    if (!user) {
      return toast.error("User not found");
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      setEmailStep(2);

      toast.success("Password verified!");
    } catch (error) {
      console.error(error);

      setCurrentPassword("");

      toast.error("Wrong password! Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();

    if (!newEmail) {
      return toast.error("Please enter a new email");
    }

    if (!user) {
      return toast.error("User not found");
    }

    setLoading(true);

    try {
      if (currentUser) {
  const userDocId = userId;

  // Pass the target ID and the specific fields to modify inside 'body'
  await updateUser({ 
    id: userDocId, 
    body: { email: newEmail } 
  }).unwrap();
  console.log(userDocId,newEmail)
  await updateEmail(user, newEmail);
  toast.success("Email updated successfully!");

      setEditEmail(false);

      setEmailModal(false);

      setEmailStep(1);

      setCurrentPassword("");

      setNewEmail("");
     }
     else{
      toast.alert('Email updated not success!')
     }
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("Please login again");
      } else {
        toast.error("Failed to update email");
      }
    } finally {
      setLoading(false);
    }
  };


  const verifyPasswordReset = async (e) => {
    e.preventDefault();

    if (!user) {
      return toast.error("User not found");
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      setPasswordStep(2);

      toast.success("Password verified!");
    } catch (error) {
      console.error(error);

      setCurrentPassword("");

      toast.error("Wrong password!");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!user) {
      return toast.error("User not found");
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, user.email);

      toast.success(
        "Password reset email sent! Check inbox/spam folder."
      );

      // RESET STATES

      setEditPass(false);

      setPassModal(false);

      setPasswordStep(1);

      setCurrentPassword("");
    } catch (error) {
      console.error(error);

      toast.error("Failed to send password reset email");
    } finally {
      setResetLoading(false);
    }
  };


  const deleteHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      return toast.error("User not found");
    }

    const confirmDelete = window.confirm(
      "Are you sure? All account data will be deleted permanently."
    );

    if (!confirmDelete) return;

    try {
      const docRef = doc(db, "users", user.uid);
      
      await deleteDoc(docRef);

      await deleteUser(user);

      toast.success("Account deleted successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      {/* HEADER */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShieldCheck className="text-blue-600" />
          Security and Settings
        </h2>

        <p className="text-gray-500 mt-2">
          Manage your account security safely.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* ========================================================= */}
        {/* EMAIL SECTION */}
        {/* ========================================================= */}

        <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div
            onClick={() => setEmailModal(!emailModal)}
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-400" />

              <div>
                <h2 className="font-semibold text-gray-700">
                  Email Address
                </h2>

                {!emailModal && (
                  <p className="text-sm text-gray-500">
                    {user?.email}
                  </p>
                )}
              </div>
            </div>

            {emailModal ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>

          {emailModal && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  {!editEmail ? (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-bold">
                        Current Email
                      </span>

                      <h2 className="text-gray-800 font-medium">
                        {user?.email}
                      </h2>
                    </div>
                  ) : (
                    <div>
                      {emailStep === 1 ? (
                        <form
                          onSubmit={verifyEmailPassword}
                          className="space-y-3"
                        >
                          <label className="text-sm font-bold text-gray-600">
                            Verify Identity
                          </label>

                          <div className="flex gap-2">
                            <input
                              type="password"
                              required
                              placeholder="Enter current password"
                              className="flex-1 border border-gray-300 rounded-md p-2"
                              value={currentPassword}
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                            />

                            <button
                              type="submit"
                              disabled={loading}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md"
                            >
                              {loading ? "Verifying..." : "Next"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form
                          onSubmit={handleEmailUpdate}
                          className="space-y-3"
                        >
                          <label className="text-sm font-bold text-green-600">
                            Enter New Email
                          </label>

                          <div className="flex gap-2">
                            <input
                              type="email"
                              required
                              placeholder="new-email@gmail.com"
                              className="flex-1 border border-gray-300 rounded-md p-2"
                              value={newEmail}
                              onChange={(e) =>
                                setNewEmail(e.target.value)
                              }
                            />

                            <button
                              type="submit"
                              disabled={loading}
                              className="bg-green-600 text-white px-4 py-2 rounded-md"
                            >
                              {loading ? "Updating..." : "Update"}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditEmail(!editEmail);

                      setEmailStep(1);

                      setCurrentPassword("");

                      setNewEmail("");
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-bold border ${
                      editEmail
                        ? "border-gray-300 text-gray-600 hover:bg-gray-100"
                        : "border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {editEmail ? "Cancel" : "Edit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* PASSWORD SECTION */}
        {/* ========================================================= */}

        <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div
            onClick={() => setPassModal(!passModal)}
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-gray-400" />

              <div>
                <h2 className="font-semibold text-gray-700">
                  Change Password
                </h2>

                {!passModal && (
                  <p className="text-sm text-gray-500">
                    ********
                  </p>
                )}
              </div>
            </div>

            {passModal ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>

          {passModal && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  {!editPass ? (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-bold">
                        Password
                      </span>

                      <h2 className="text-gray-800 font-medium">
                        ********
                      </h2>
                    </div>
                  ) : (
                    <div>
                      {passwordStep === 1 ? (
                        <form
                          onSubmit={verifyPasswordReset}
                          className="space-y-3"
                        >
                          <label className="text-sm font-bold text-gray-600">
                            Verify Identity
                          </label>

                          <div className="flex gap-2">
                            <input
                              type="password"
                              required
                              placeholder="Enter current password"
                              className="flex-1 border border-gray-300 rounded-md p-2"
                              value={currentPassword}
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                            />

                            <button
                              type="submit"
                              disabled={loading}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md"
                            >
                              {loading ? "Verifying..." : "Next"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form
                          onSubmit={handlePasswordReset}
                          className="space-y-3"
                        >
                          <label className="text-sm font-bold text-green-600">
                            Send Password Reset Email
                          </label>

                          <button
                            type="submit"
                            disabled={resetLoading}
                            className="bg-green-600 text-white px-4 py-2 rounded-md"
                          >
                            {resetLoading
                              ? "Sending..."
                              : "Send Reset Email"}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditPass(!editPass);

                      setPasswordStep(1);

                      setCurrentPassword("");
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-bold border ${
                      editPass
                        ? "border-gray-300 text-gray-600 hover:bg-gray-100"
                        : "border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {editPass ? "Cancel" : "Edit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* DELETE ACCOUNT */}
        {/* ========================================================= */}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={deleteHandler}
            className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors"
          >
            Delete Account
          </button>

          <p className="text-xs text-gray-400 mt-2 italic">
            Permanently delete your account and all associated data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Security;