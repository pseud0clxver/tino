import Hero from "./hero";
import Gallery from "./gallery";

const ProposalContent: React.FC = () => {
  return (
    <div style={{ background: "#0f172a", minHeight: "100vh" }}>
      <Hero />
      <Gallery />
      <footer
        style={{ padding: "100px", textAlign: "center", color: "#a78bfa" }}
      >
        Forever starts now.
      </footer>
    </div>
  );
};
export default ProposalContent;
