import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer
      style={{
        background: "linear-gradient(to right, #c2e9fb, #a1c4fd)",
        color: "black",
        paddingTop: "40px",
        paddingBottom: "55px",
      }}
    >
      <div className="container ">
        <div className="row justify-content-center text-center text-md-start">

          {/* Learn More */}
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase fw-bold mb-3">Learn More</h5>
            <div className="footer-text">
              <a className="d-block text-decoration-none mb-1" style={{ color: "black" }} href="/privacypolicy">Privacy Policy</a>
              <a className="d-block text-decoration-none mb-1" style={{ color: "black" }} href="#">Terms & Conditions</a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase fw-bold mb-3">Get in Touch</h5>
            <p className="mb-1" style={{ color: "black" }}>
              <i className="fas fa-envelope me-2 text-warning"></i> ffproject004@gmail.com
            </p>
            <p style={{ color: "black" }}>
              <i className="fas fa-phone me-2 text-success"></i> +91 83207 57745
            </p>
          </div>

          {/* Social Icons */}
          <div className="col-md-6 mb-4 text-center">
            <h5 className="text-uppercase fw-bold mb-3">Follow Us</h5>
            <div className="d-flex justify-content-center gap-4 flex-wrap">
              {[
                "instagram", "facebook", "youtube", "linkedin", "whatsapp", "twitter", "pinterest",
              ].map((platform) => (
                <a
                  key={platform}
                  href={`https://www.${platform}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fs-4"
                  style={{ color: "black" }}
                >
                  <i className={`fab fa-${platform}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <hr style={{ borderColor: "rgba(0,0,0,0.2)" }} />
        <div className="text-center" style={{ color: "black" }}>
          <p className="mb-1">Popular Searches: How to Buy | Track Orders | FAQs | Rewards</p>
          <p className="mb-0">© 2025 <strong>Tailortech Pvt. Ltd.</strong> All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
