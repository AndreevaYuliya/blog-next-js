"use client";

import { FC, useState } from "react";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import {
  AppBar,
  Box,
  Button,
  colors,
  Divider,
  IconButton,
  Menu,
  Typography,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import routes from "@/config/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { clearUser } from "@/stores/slices/userSlice";
import { User } from "@/types/User";

import { logOutUser } from "@/features/auth/services/userActions";

import { StyledMenuItem } from "@/styles/muiStyles";

import styles from "./styles";

type Props = {
  title: string;
  handleScrollTop?: () => void;
  initialUser?: User | null;
};

const ControlBar: FC<Props> = (props) => {
  const { title, handleScrollTop, initialUser } = props;

  const router = useRouter();
  const pathname = usePathname();

  const storeUser = useAppSelector((state) => state.user.user);
  const resolvedUser = storeUser ?? initialUser ?? null;
  const isAuthenticated = Boolean(resolvedUser);
  const user = resolvedUser?.username;

  const location = { pathname };

  const dispatch = useAppDispatch();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const pages = isAuthenticated
    ? ["Home", "My Posts", "Create New Post"]
    : ["Home"];

  const pageRoutes: Record<string, string> = {
    Home: routes.stripe,
    "My Posts": routes.home,
    "Create New Post": routes.newPost,
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogOut = async () => {
    await logOutUser();

    dispatch(clearUser());

    router.push(routes.stripe);
  };

  return (
    <AppBar sx={styles.headerContainer}>
      <Box sx={styles.titleContainer}>
        <Typography variant="h5" sx={styles.title} onClick={handleScrollTop}>
          {title}
        </Typography>

        <Box sx={styles.menuButtonContainer}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={styles.menuContainer}
          >
            {pages.map((page) => {
              const route = pageRoutes[page];
              const isActive = route ? location.pathname === route : false;

              return (
                <StyledMenuItem
                  key={page}
                  component={Link}
                  href={route}
                  selected={isActive}
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">{page}</Typography>
                </StyledMenuItem>
              );
            })}
          </Menu>
        </Box>

        <Box sx={styles.buttonsContainer}>
          {pages.map((page) => {
            const route = pageRoutes[page];
            const isActive = route ? location.pathname === route : false;

            return (
              <Button
                key={page}
                component={Link}
                href={route}
                sx={styles.navButton(isActive)}
              >
                {page}
              </Button>
            );
          })}
        </Box>

        <Box sx={styles.userContainer}>
          {user && (
            <>
              <Typography
                component="span"
                color={colors.common.white}
                fontWeight="bold"
              >
                {user}
              </Typography>

              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={styles.divider}
              />
            </>
          )}

          {!isAuthenticated ? (
            <IconButton component={Link} href={routes.login} sx={styles.icon}>
              <PersonIcon htmlColor={colors.common.white} />
            </IconButton>
          ) : (
            <IconButton onClick={handleLogOut} sx={styles.icon}>
              <LogoutIcon htmlColor={colors.common.white} />
            </IconButton>
          )}
        </Box>
      </Box>
    </AppBar>
  );
};

export default ControlBar;

