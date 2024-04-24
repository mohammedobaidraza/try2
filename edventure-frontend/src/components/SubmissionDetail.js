import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SubmissionDetail = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  console.log("Extracted ID:", id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      console.error("No ID provided");
      return; // Early return to avoid making a request with undefined ID
    }
  
    fetch(`http://localhost:5000/api/submissions/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setSubmission(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching details:', error);
        setError(error);
        setLoading(false);
      });
  }, [id]); // Dependency array with `id` to refetch if the id changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!submission) {
    return <div>No data found for this submission.</div>;
  }

  // Display the details of the submission
  return (
    <div>
      <h1>Submission Details</h1>
      <p><strong>ID:</strong> {submission.id}</p>
      <p><strong>Email:</strong> {submission.email}</p>
      <p><strong>Name:</strong> {submission.name}</p>
      <p><strong>Mobile:</strong> {submission.mobileNumber}</p>
      {/* Display other fields from the submission object as needed */}
      <p><strong>College Name:</strong> {submission.collegeName}</p>
      <p><strong>Alpha Skill Set:</strong> {submission.alphaSkillSet}</p>
      <p><strong>Discovery Channel:</strong> {submission.discoveryChannel}</p>
      <p><strong>Motivation:</strong> {submission.motivation}</p>
      <p><strong>Value Addition:</strong> {submission.valueAddition}</p>
      <p><strong>Date:</strong> {submission.date}</p>
      <p><strong>Status:</strong> {submission.status}</p>
      {/* ... and so on for other properties of the submission */}
    </div>
  );
};

export default SubmissionDetail;
