import InfiniteCarousel from "./InfiniteCarousel";
import CountUpTimer from "../countdown/CountUpTimer";

interface Props {
  targetDate: string;
  onProceed: () => void;
}

const ProposalContent: React.FC<Props> = ({ targetDate, onProceed }) => {
  return (
    <div className="relative min-h-screen bg-transparent">
      <CountUpTimer startDate={targetDate} isFixed={false} />
      <InfiniteCarousel onProceed={onProceed} />
    </div>
  );
};
export default ProposalContent;
