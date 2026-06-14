export const price = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

export const colorStyles = {
  blue: {
    soft: "bg-blue-50 text-upchar-blue",
    ring: "ring-blue-100",
    border: "border-upchar-blue",
    line: "bg-upchar-blue"
  },
  green: {
    soft: "bg-green-50 text-upchar-green",
    ring: "ring-green-100",
    border: "border-upchar-green",
    line: "bg-upchar-green"
  },
  red: {
    soft: "bg-red-50 text-upchar-red",
    ring: "ring-red-100",
    border: "border-upchar-red",
    line: "bg-upchar-red"
  },
  orange: {
    soft: "bg-orange-50 text-upchar-orange",
    ring: "ring-orange-100",
    border: "border-upchar-orange",
    line: "bg-upchar-orange"
  },
  purple: {
    soft: "bg-violet-50 text-upchar-purple",
    ring: "ring-violet-100",
    border: "border-upchar-purple",
    line: "bg-upchar-purple"
  },
  teal: {
    soft: "bg-teal-50 text-upchar-teal",
    ring: "ring-teal-100",
    border: "border-upchar-teal",
    line: "bg-upchar-teal"
  }
};

export const getColor = (color = "blue") => colorStyles[color] || colorStyles.blue;
