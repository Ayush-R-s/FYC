export const printFeedback = (feedback) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups to print feedback.');
        return;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Feedback Details</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333; }
                h1 { color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #666; font-size: 0.9em; }
                .value { font-size: 1.1em; margin-top: 5px; }
                .comments { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <h1>Feedback Report</h1>
            
            <div class="field">
                <div class="label">Student Name</div>
                <div class="value">${feedback.studentName || 'N/A'}</div>
            </div>
            
            <div class="field">
                <div class="label">Student ID</div>
                <div class="value">${feedback.studentId || 'N/A'}</div>
            </div>
            
            <div class="field">
                <div class="label">Faculty Name</div>
                <div class="value">${feedback.facultyName || 'N/A'}</div>
            </div>
            
            <div class="field">
                <div class="label">Subject</div>
                <div class="value">${feedback.subject || 'N/A'}</div>
            </div>
            
            <div class="field">
                <div class="label">Date & Time</div>
                <div class="value">${feedback.date || ''} ${feedback.time || ''}</div>
            </div>
            
            <div class="field">
                <div class="label">Rating</div>
                <div class="value">${feedback.rating || 0} / 5</div>
            </div>
            
            <div class="comments">
                <div class="label">Comments</div>
                <div class="value">${feedback.comments || 'No comments provided.'}</div>
            </div>
            
            <script>
                window.onload = function() { window.print(); window.close(); }
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

export const downloadFeedback = (feedback) => {
    const textContent = `
FEEDBACK REPORT
--------------------------------
Student Name: ${feedback.studentName || 'N/A'}
Student ID:   ${feedback.studentId || 'N/A'}
Faculty Name: ${feedback.facultyName || 'N/A'}
Subject:      ${feedback.subject || 'N/A'}
Date:         ${feedback.date || 'N/A'}
Time:         ${feedback.time || 'N/A'}
Rating:       ${feedback.rating || 0}/5

COMMENTS
--------------------------------
${feedback.comments || 'No comments provided.'}
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Feedback_${feedback.studentId || 'Report'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};
