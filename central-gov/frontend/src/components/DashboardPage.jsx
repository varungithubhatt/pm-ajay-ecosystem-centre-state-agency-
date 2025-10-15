import React from "react";
import Navbar from "./Navbar";
import { Card, CardActions, CardContent, Button, Typography, Box } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllSchemes } from "../features/scheme/schemeSlice";
import { getFundAllocations } from "../features/fund/fundSlice";
import { generateReport } from "../features/report/reportSlice";

export default function DashBoardPage() {
  const dispatch = useDispatch();
  const { schemes } = useSelector((state) => state.scheme);
  const { loading } = useSelector((state) => state.report);
  const { allocations } = useSelector((state) => state.fund);

  const totalSchemes = schemes.length;

  const totalAllocated = (allocations || []).reduce(
    (sum, alloc) => sum + (alloc.allocatedAmount || 0),
    0
  );

  const totalReleased = (allocations || []).reduce(
    (sum, alloc) => sum + (alloc.releasedAmount || 0),
    0
  );

  const overallCompliance = totalAllocated > 0
    ? (totalReleased / totalAllocated) * 100
    : 0;

  useEffect(() => {
    dispatch(getAllSchemes());
    dispatch(getFundAllocations());
  }, [dispatch]);

  const handleGenerateReport = () => {
    dispatch(generateReport("fund-allocation"));
  };

  const dataCards = [
    {
      title: "Villages",
      subtitle: "Villages currently participating in schemes",
      note: "Provides an overview of how many villages  are actively implementing central schemes.",
      buttonText: "View Villages",
      link: "/villages"
    },
    {
      title: "Fund Allocated",
      subtitle: "Total fund sanctioned across schemes",
      note: "Shows the total budget allocated to all active government schemes during this fiscal year.",
      buttonText: "View Allocation",
      link: "/villages/funds/records"
    },
    {
      title: "Progress Reports",
      subtitle: "Progress Reports Submitted by agencies",
      note: "Help in monitoring the implementation status of the development tasks",
      buttonText: "View Reports",
      link: "/progress-reports"
    },
    {
      title: "Compliance Rate",
      value: `${overallCompliance.toFixed(2)}%`,
      subtitle: "Adherence to reporting and fund utilization guidelines",
      note: "Measures the percentage of states and agencies complying with central government guidelines and deadlines.",
      buttonText: "View Compliance",
    },
    {
      title: "Pending Reports",
      value: "18",
      subtitle: "Reports awaiting submission from states/UTs",
      note: "Highlights which reports are pending for review and approval at the central level.",
      buttonText: "View Reports",
    },
    {
      title: "Active States/UTs",
      value: "29",
      subtitle: "States currently participating in schemes",
      note: "Provides an overview of how many states and union territories are actively implementing central schemes.",
      buttonText: "View States",
    },
    {
      title: "Total Schemes",
      value: `${totalSchemes}`,
      subtitle: "Active programs under central ministries",
      note: "Overview of all schemes currently implemented and monitored by the central government.",
      buttonText: "View Schemes",
      link: "/scheme/record"
    },
    {
      title: "Total Fund Utilized",
      value: "₹ 980 Cr",
      subtitle: "Amount actually spent by states and implementing agencies",
      note: "Tracks the fund disbursed and utilized under various schemes across all regions.",
      buttonText: "View Utilization",
    }
  ];

  return (
    <>
      <Navbar />

      {/* Dashboard Header */}
      <Box sx={{ mt: 3, ml: 3 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            letterSpacing: "1px",
            color: "#1a237e",
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          Welcome to Dashboard
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#3949ab",
            fontStyle: "italic",
            letterSpacing: "0.5px",
          }}
        >
          Manage schemes, funds, and reports efficiently
        </Typography>
      </Box>

      {/* Main Layout (Cards + Records Panel) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Data Cards Section */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            flex: "1 1 70%",
          }}
        >
          {dataCards.map((card, index) => (
            <Card
              key={index}
              sx={{
                width: 320,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardContent>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                  gutterBottom
                >
                  {card.title}
                </Typography>
                <Typography variant="h6" component="div" gutterBottom>
                  {card.value}
                </Typography>
                <Typography
                  sx={{ color: "text.secondary", mb: 1.5 }}
                  gutterBottom
                >
                  {card.subtitle}
                </Typography>
                <Typography variant="body2">{card.note}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={card.link ? Link : "button"}
                  to={card.link || undefined}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {card.buttonText}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>

        {/* Records Panel */}
        <Box
          sx={{
            flex: "0 0 250px",
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
            p: 3,
            ml: 2,
            // height: "70vh",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 2, color: "#1a237e" }}
          >
            Records Panel
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="outlined"
              component={Link}
              to="/scheme/record"
              sx={{
                color: "#1e3a8a",
                borderColor: "#1e3a8a",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#e0e7ff" },
              }}
            >
              View Schemes Record
            </Button>

            <Button
              variant="outlined"
              component={Link}
              to="/funds/records"
              sx={{
                color: "#065f46",
                borderColor: "#065f46",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#d1fae5" },
              }}
            >
              View Funds Record
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Quick Actions Section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 3,
          justifyContent: "space-between",
        }}
      >
        {[
          {
            to: "/scheme/upload",
            icon: <UploadIcon />,
            title: "Upload New Scheme",
            caption: "Add new government scheme",
            bgColor: "#dbeafe",
            color: "#1e40af",
            hoverBg: "#bfdbfe",
          },
          {
            to: "/fund/allocate",
            icon: <AttachMoneyIcon />,
            title: "Allocate Funds",
            caption: "Distribute funds to states",
            bgColor: "#d1fae5",
            color: "#065f46",
            hoverBg: "#a7f3d0",
          },
          {
            to: "/add-village",
            icon: <UploadIcon />,
            title: "Add Village Eligible For PM-AJAY SCHEME",
            caption: "Submit details of eligible village",
            bgColor: "#e0f2fe",
            color: "#075985",
            hoverBg: "#bae6fd",
          },
          {
            onClick: handleGenerateReport,
            icon: <AssessmentIcon />,
            title: loading
              ? (
                <Typography variant="body2" color="text.secondary">
                  Generating...
                </Typography>
              )
              : (
                <>
                  Generate Reports
                  <Typography variant="caption" color="text.secondary">
                    Create PDF/Excel reports
                  </Typography>
                </>
              ),
            bgColor: "#ede9fe",
            color: "#5b21b6",
            hoverBg: "#ddd6fe",
            disabled: loading,
          },
          {
            icon: <EmailIcon />,
            title: "Send Reminders",
            caption: "Alert states about deadlines",
            bgColor: "#fefcbf",
            color: "#854d0e",
            hoverBg: "#fef08a",
          },
        ].map(
          (
            {
              to,
              onClick,
              icon,
              title,
              caption,
              bgColor,
              color,
              hoverBg,
              disabled,
            },
            index
          ) => (
            <Button
              key={index}
              variant="contained"
              sx={{
                bgcolor: bgColor,
                color: color,
                "&:hover": { bgcolor: hoverBg },
                justifyContent: "space-between",
                borderRadius: 2,
                p: 1.5,
                width: "calc(50% - 8px)", // two buttons per row with gap
                minWidth: "200px",
                mb: 1,
              }}
              startIcon={icon}
              component={to ? Link : "button"}
              to={to || undefined}
              onClick={onClick}
              disabled={disabled}
            >
              {typeof title === "string" ? (
                <>
                  {title}
                  {caption && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {caption}
                    </Typography>
                  )}
                </>
              ) : (
                title
              )}
            </Button>
          )
        )}
      </Box>
    </>
  );
}
