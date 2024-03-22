import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import classNames from "classnames";
import {
  Cross1Icon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import useMountEffect from "$lib/useMountEffect";
import useModal from "$lib/useModal";
import IconButton from "$components/IconButton";
import LinkAnchor from "$components/LinkAnchor";
import SearchDialog from "$components/SearchDialog";

const appTitle = "Mediarr";

export default function NavBar() {
  const mount = useModal();
  const [y, setY] = useState(0);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const pathname = window.location.pathname;

  useLocation();

  useMountEffect(() => {
    const onScroll = () => setY(window.scrollY);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        openSearchModal();
      }
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  useEffect(() => {
    setIsMobileMenuVisible(false);
  }, [pathname]);

  const openSearchModal = () => {
    mount((_, unmount) => <SearchDialog onClose={unmount} />);
  };

  const transparent = y <= 0;
  const baseStyle = classNames(
    "fixed px-8 inset-x-0 grid-cols-[min-content_1fr_min-content] items-center z-10",
    "transition-all",
    {
      "bg-stone-900 bg-opacity-50 backdrop-blur-2xl":
        !isMobileMenuVisible && !transparent,
      "h-16": !transparent,
      "h-16 sm:h-24": transparent,
    }
  );

  function getLinkStyle(path: string) {
    return classNames("selectable rounded-sm px-2 -mx-2 sm:text-base text-xl", {
      "text-amber-200": pathname === path,
      "hover:text-zinc-50 cursor-pointer": pathname !== path,
    });
  }

  const links = (
    <>
      <LinkAnchor href="/" className={getLinkStyle("/")}>
        Home
      </LinkAnchor>
      <LinkAnchor href="/movies" className={getLinkStyle("/movies")}>
        Movies
      </LinkAnchor>
      <LinkAnchor href="/series" className={getLinkStyle("/series")}>
        TV Shows
      </LinkAnchor>
    </>
  );

  return (
    <>
      <div className={classNames(baseStyle, "hidden sm:grid")}>
        <LinkAnchor
          href="/"
          className="hidden sm:flex gap-2 items-center hover:text-inherit selectable rounded-sm px-2 -mx-2"
        >
          <div className="rounded-full bg-rose-500 h-4 w-4" />
          <h1 className="font-display uppercase font-semibold tracking-wider text-xl">
            {appTitle}
          </h1>
        </LinkAnchor>
        <div className="flex items-center justify-center gap-4 md:gap-8 font-normal text-sm tracking-wider text-zinc-200">
          {links}
        </div>
        <div className="flex items-center justify-center gap-4 md:gap-8 font-normal text-sm tracking-wider text-zinc-200">
          <a
            role="button"
            className={classNames(getLinkStyle(""), "flex items-center gap-2")}
            onClick={(e) => {
              e.preventDefault();
              openSearchModal();
            }}
          >
            Search
            <MagnifyingGlassIcon width={20} height={20} />
          </a>
        </div>
      </div>

      <div className={classNames(baseStyle, " grid sm:hidden")}>
        <LinkAnchor
          href="/"
          className="flex gap-2 items-center hover:text-inherit selectable rounded-sm px-2 -mx-2"
        >
          <div className="rounded-full bg-amber-300 h-4 w-4" />
          <h1 className="font-display uppercase font-semibold tracking-wider text-xl">
            {appTitle}
          </h1>
        </LinkAnchor>
        <div />
        <div className="flex items-center gap-2">
          <IconButton onClick={openSearchModal}>
            <MagnifyingGlassIcon width={20} height={20} />
          </IconButton>

          {isMobileMenuVisible ? (
            <IconButton onClick={() => setIsMobileMenuVisible(false)}>
              <Cross1Icon width={20} height={20} />
            </IconButton>
          ) : (
            <IconButton onClick={() => setIsMobileMenuVisible(true)}>
              <HamburgerMenuIcon width={20} height={20} />
            </IconButton>
          )}
        </div>
      </div>

      {isMobileMenuVisible && (
        <div className="fixed inset-0 pt-16 bottom-0 bg-stone-900 bg-opacity-50 backdrop-blur-2xl z-[9] grid grid-rows-3 transition-all ease-linear">
          <div className="row-span-2 flex flex-col gap-4 items-center justify-center">
            {links}
          </div>
        </div>
      )}
    </>
  );
}
