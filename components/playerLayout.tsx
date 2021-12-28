import { Box } from "@chakra-ui/layout";
import Sidebar from "./sidebar";

const PlayerLayout = ({ children }) => {
  return (
    <Box width="100vw" height="100vh">
      {/* sidebar */}
      <Box position="absolute" top="0" width="250px" left="0">
        <Sidebar />
      </Box>
      <Box marginLeft="250px" marginBottom="100px">
        <Box>{children}</Box>
      </Box>
      {/* player */}
      <Box position="absolute" bottom="0" left="0">
        player
      </Box>
    </Box>
  );
};

export default PlayerLayout;
