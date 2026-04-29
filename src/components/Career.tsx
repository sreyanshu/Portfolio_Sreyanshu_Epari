import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Computer Science and Engineering</h4>
                <h5>Institute of Technical Education and Research (ITER)</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Currently pursuing Bachelor of Technology in Computer Science and Engineering. CGPA: 7.86.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Cybersecurity Trainee</h4>
                <h5>EY-GDS</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Applied real-world cybersecurity scenarios to identify vulnerabilities and recommended effective mitigation strategies. Enhanced understanding of network security, access control, and compliance standards. Developed skills in security monitoring, threat analysis, and IAM practices.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Machine Learning Trainee</h4>
                <h5>Tata Steel</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Applied supervised and unsupervised learning to analyze datasets and derive actionable insights. Built predictive models for classification and regression tasks to improve industrial processes. Leveraged domain-specific data to support real-world optimization and analytics challenges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
