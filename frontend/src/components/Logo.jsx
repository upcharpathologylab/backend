import upcharLogo from "../assets/upchar-logo.png";

function Logo({ light = false, size = "default" }) {
  const large = size === "large";

  return (
    <a
      href="/"
      className={`inline-flex shrink-0 items-center rounded-lg bg-white ${light ? "p-2" : ""}`}
      aria-label="Upchar Pathology home"
    >
      <img
        src={upcharLogo}
        alt="Upchar Pathology - Trusted Care. Accurate Reports."
        className={`${large ? "h-11 w-[200px] sm:h-12 sm:w-[230px] lg:h-14 lg:w-[270px]" : "h-10 w-[205px]"} object-contain object-left`}
      />
    </a>
  );
}

export default Logo;
