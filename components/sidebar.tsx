import NextImage from "next/image";
import NextLink from "next/link";
import {
  Box,
  List,
  ListItem,
  ListIcon,
  Divider,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/layout";
import {
  MdHome,
  MdSearch,
  MdLibraryMusic,
  MdPlaylistAdd,
  MdFavorite,
} from "react-icons/md";
import { usePlaylist } from "../lib/hooks";

const navMenu = [
  {
    name: "Home",
    icon: MdHome,
    route: "/",
  },
  {
    name: "Search",
    icon: MdSearch,
    route: "/search",
  },
  {
    name: "Your Library",
    icon: MdLibraryMusic,
    route: "/library",
  },
];

const musicMenu = [
  {
    name: "Create Playlist",
    icon: MdPlaylistAdd,
    route: "/",
  },
  {
    name: "Favorites",
    icon: MdFavorite,
    route: "/favorites",
  },
];

// const playlists = new Array(10).fill(1).map((_, i) => `Playlist ${i + 1}`);

const Sidebar = () => {
  const { playlists } = usePlaylist();

  return (
    <Box
      width="100%"
      height="calc(100vh - 100px)"
      bg="black"
      paddingX="5px"
      color="gray"
    >
      <Box paddingY="20px" height="100%">
        {/* logo */}
        <Box width="120px" marginBottom="20px" paddingX="20px">
          <NextImage src="/tracks.svg" alt="logo" height={60} width={120} />
        </Box>
        {/* menu top */}
        <Box marginBottom="20px">
          <List spacing={2}>
            <List spacing={2}>
              {navMenu.map((item) => (
                <ListItem key={item.name} paddingX="20px" fontSize="16px">
                  <LinkBox>
                    <NextLink href={item.route} passHref>
                      <LinkOverlay>
                        <ListIcon
                          as={item.icon}
                          color="white"
                          marginRight="20px"
                        />
                        {item.name}
                      </LinkOverlay>
                    </NextLink>
                  </LinkBox>
                </ListItem>
              ))}
            </List>
          </List>
        </Box>

        {/* music menu */}
        <Box marginTop="20px">
          <List spacing={2}>
            {musicMenu.map((item) => (
              <ListItem key={item.name} paddingX="20px" fontSize="16px">
                <LinkBox>
                  <NextLink href={item.route} passHref>
                    <LinkOverlay>
                      <ListIcon
                        as={item.icon}
                        color="white"
                        marginRight="20px"
                      />
                      {item.name}
                    </LinkOverlay>
                  </NextLink>
                </LinkBox>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider color="gray.800" />
        <Box height="66%" overflowY="auto" paddingY="20px">
          <List spacing={2}>
            {playlists.map((playlist) => (
              <ListItem paddingX="20px" key={playlist.id}>
                <LinkBox>
                  <NextLink
                    href={{
                      pathname: "/playlist/[id]",
                      query: { id: playlist.id },
                    }}
                    passHref
                  >
                    <LinkOverlay>{playlist.name}</LinkOverlay>
                  </NextLink>
                </LinkBox>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
