import { Typography, useTheme } from "@mui/material";
import Flexbetween from "../components/Flexbetween";
import WidgetWrapper from "../components/WidgetWrapper";


const AdvertWidget = () => {

  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <Flexbetween>
        <Typography color={dark} variant="h4" fontWeight="500" fontFamily="serif">
          Sponsored
        </Typography>
        <Typography color={medium} fontFamily="serif" variant="h5">Create Ad</Typography>
      </Flexbetween>
      <img width="100%" height="auto" alt="Ad" src={require("../assets/Ad.jpg")}
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <Flexbetween>
        <Typography color={main} fontFamily="serif">Graphic Design</Typography>
        <Typography color={medium} fontFamily="serif">www.demo.com</Typography>
      </Flexbetween>
      <Typography color={medium} m="0.5rem 0" fontFamily="serif">
        In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a 
        typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
