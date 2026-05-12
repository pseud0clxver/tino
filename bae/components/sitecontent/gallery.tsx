const Gallery: React.FC = () => (
  <section
    style={{
      padding: "50px",
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
    }}
  >
    {/* You can map through your photos here */}
    <div
      style={{
        height: "300px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "15px",
      }}
    ></div>
    <div
      style={{
        height: "300px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "15px",
      }}
    ></div>
    <div
      style={{
        height: "300px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "15px",
      }}
    ></div>
  </section>
);
export default Gallery;
