import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Work = () => {
  useGSAP(() => {
  let translateX: number = 0;

  function setTranslateX() {
    const box = document.getElementsByClassName("work-box");
    const rectLeft = document
      .querySelector(".work-container")!
      .getBoundingClientRect().left;
    const rect = box[0].getBoundingClientRect();
    const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
    let padding: number =
      parseInt(window.getComputedStyle(box[0]).padding) / 2;
    translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    translateX = Math.max(0, translateX);
  }

  setTranslateX();

  let timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".work-section",
      start: "top top",
      end: `+=${translateX}`, // Use actual scroll width
      scrub: true,
      pin: true,
      id: "work",
    },
  });

  timeline.to(".work-flex", {
    x: -translateX,
    ease: "none",
  });

  // Clean up (optional, good practice)
  return () => {
    timeline.kill();
    ScrollTrigger.getById("work")?.kill();
  };
}, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {[
            {
              name: "Machine Idle Time Analysis",
              category: "Machine Learning",
              tools: "Python, Scikit-learn, Pandas, NumPy",
              about: "Designed a K-Means clustering model to analyze idle time patterns. Engineered performance metrics for better utilization insights.",
              image: "/images/machine_idle.png",
              link: "https://github.com/sreyanshu/Machine_idle_time_analysis-Tata-Steel-"
            },
            {
              name: "Shoulder Surfing Detection",
              category: "Cybersecurity & AI",
              tools: "Python, OpenCV, MediaPipe",
              about: "Developed a real-time defense system using webcam-based skeletal tracking. Integrated gaze angle and facial proximity detection.",
              image: "/images/shoulder_surfing.png",
              link: "https://github.com/sreyanshu/Shoulder-Surfing-Attack-Detection-System"
            },
            {
              name: "Smart DDoS-Detector",
              category: "Cybersecurity",
              tools: "Python",
              about: "A lab environment that simulates and detects DDoS traffic. Features a detection system that blocks incoming attacking bot IPs from the victim server.",
              image: "/images/smart_ddos.png",
              link: "https://github.com/sreyanshu/Smart-DDoS-Detector"
            }
          ].map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {project.name}
                      </a>
                    </h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
                
                <h4 style={{ marginTop: '20px' }}>About</h4>
                <p>{project.about}</p>
              </div>
              <WorkImage image={project.image} alt={project.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
