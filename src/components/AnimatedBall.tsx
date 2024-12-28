import { motion } from "framer-motion";

interface AnimatedBallProps {
  movement: number;
}

const AnimatedBall: React.FC<AnimatedBallProps> = ({ movement }) => {
  return (
    <motion.div
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        backgroundColor: "blue",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        x: movement, // move ball based on input
      }}
      transition={{ type: "spring", stiffness: 100 }}
    />
  );
};

export default AnimatedBall;
