import { seedDatabase } from '../base/base.seed';
import { Elements } from './elements.model';
import { IElements } from './elements.types';

const defaultElementss = [
  {
    success: true,
    status: 200,
    message: "Fetched elements successfully",
    data: [
      {
        _id: "690ce0d95c8bf312b9d8af29",
        type: "button",
        data: {
          text: "Go Home",
          variant: "outlined",
          action: {
            type: "internalNav",
            pageLinkId: "690cff5f615e38cf06d1c538"
          }
        },
        sx: {
          borderColor: "$theme.primary.main",
          color: "$theme.primary.main",
          "&:hover": {
            backgroundColor: "$theme.primary.main",
            color: "$theme.primary.content"
          }
        },
        children: [],
        order: 3,
        createdAt: "2025-11-06T17:54:33.338Z",
        updatedAt: "2025-11-07T15:12:27.699Z",
        __v: 0,
        name: "page not found go home button"
      },
      {
        _id: "690ce1455c8bf312b9d8af2b",
        type: "typography",
        data: {
          variant: "h6",
          text: "Not all who wander are lost. But you sure are."
        },
        sx: {
          fontWeight: "bold",
          mb: 3
        },
        children: [],
        order: 2,
        createdAt: "2025-11-06T17:56:21.769Z",
        updatedAt: "2025-11-06T18:02:36.975Z",
        __v: 0,
        name: "page not found body"
      },
      {
        _id: "690ce1bc5c8bf312b9d8af2d",
        type: "typography",
        data: {
          variant: "h1",
          text: "404"
        },
        sx: {
          color: "$theme.primary.main",
          mb: 2,
          fontWeight: "bold",
          fontFamily: "PrimaryFont",
          fontSize: {
            xs: "5rem",
            md: "8rem"
          },
          lineHeight: 1
        },
        children: [],
        order: 0,
        createdAt: "2025-11-06T17:58:20.369Z",
        updatedAt: "2025-11-06T18:01:42.801Z",
        __v: 0,
        name: "page not found heading"
      },
      {
        _id: "690ce2205c8bf312b9d8af2f",
        type: "box",
        data: {
          component: "img",
          src: "/images/404.png",
          alt: "Page not found"
        },
        sx: {
          width: "100%",
          maxWidth: 400,
          objectFit: "contain",
          mb: 3
        },
        children: [],
        order: 1,
        createdAt: "2025-11-06T18:00:00.055Z",
        updatedAt: "2025-11-06T18:02:16.463Z",
        __v: 0,
        name: "page not found image"
      },
      {
        _id: "690ce4d25c8bf312b9d8af45",
        type: "box",
        sx: {
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          minHeight: "calc(100vh - 50px)",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "$theme.neutral.main"
        },
        children: [
          "690ce46e5c8bf312b9d8af43"
        ],
        order: 0,
        createdAt: "2025-11-06T18:11:30.665Z",
        updatedAt: "2025-11-06T18:13:47.629Z",
        __v: 0,
        name: "page not found root"
      },
      {
        _id: "690d055615bdbbd3977a4621",
        type: "box",
        sx: {
          width: "100%",
          minHeight: "calc(100vh - 64px)",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        },
        children: [
          "690ce1bc5c8bf312b9d8af2d",
          "690ce2205c8bf312b9d8af2f",
          "690ce1455c8bf312b9d8af2b",
          "690ce0d95c8bf312b9d8af29"
        ],
        order: 0,
        createdAt: "2025-11-06T20:30:14.659Z",
        updatedAt: "2025-11-06T20:33:22.900Z",
        __v: 0,
        name: "page not found container"
      },
      {
        _id: "690d2ac2f96d2590ee5adc50",
        name: "navbar logo",
        type: "box",
        data: {
          component: "img",
          src: "/images/Logo.png",
          alt: "Rkitech Logo"
        },
        sx: {
          height: "100%",
          maxHeight: 48,
          objectFit: "contain"
        },
        children: [],
        order: 0,
        createdAt: "2025-11-06T23:09:54.337Z",
        updatedAt: "2025-11-06T23:09:54.337Z",
        __v: 0
      },
      {
        _id: "690d2b4bf96d2590ee5adc52",
        name: "navbar logo text",
        type: "typography",
        data: {
          variant: "h6",
          text: "Rkitech"
        },
        sx: {
          fontFamily: "PrimaryFont",
          color: "$theme.primary.main",
          ml: 1
        },
        children: [],
        order: 1,
        createdAt: "2025-11-06T23:12:11.616Z",
        updatedAt: "2025-11-06T23:24:16.463Z",
        __v: 0
      },
      {
        _id: "690d2ce5f96d2590ee5adc59",
        name: "navbar logo section container",
        type: "animbox",
        sx: {
          display: "flex",
          alignItems: "center"
        },
        children: [
          "690d2ac2f96d2590ee5adc50",
          "690d2b4bf96d2590ee5adc52"
        ],
        order: 0,
        createdAt: "2025-11-06T23:19:01.882Z",
        updatedAt: "2025-11-06T23:44:21.901Z",
        __v: 0,
        data: {
          animationObject: {
            entranceAnimation: "animate__fadeInLeft",
            exitAnimation: "animate__fadeOutLeft",
            isEntering: true
          }
        }
      },
      {
        _id: "690d2f31f96d2590ee5adc60",
        name: "navbar menu section container",
        type: "box",
        sx: {
          display: {
            xs: "none",
            md: "flex"
          },
          alignItems: "center",
          fontFamily: "SecondaryFont"
        },
        children: [
          "690d41c85bd6b934f77e2ddb",
          "690e1d235bd6b934f77e303d"
        ],
        order: 1,
        createdAt: "2025-11-06T23:28:49.519Z",
        updatedAt: "2025-11-08T16:47:37.685Z",
        __v: 0
      },
      {
        _id: "690d2f77f96d2590ee5adc64",
        name: "navbar toolbar",
        type: "toolbar",
        sx: {
          position: "relative",
          zIndex: 3,
          bgcolor: "$theme.neutral2.main",
          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          justifyContent: "space-between",
          height: 64
        },
        children: [
          "690d2ce5f96d2590ee5adc59",
          "690d2f31f96d2590ee5adc60",
          "690f73333235cfb5a27e2653"
        ],
        order: 0,
        createdAt: "2025-11-06T23:29:59.350Z",
        updatedAt: "2025-11-08T16:48:35.197Z",
        __v: 0
      },
      {
        _id: "690d3003f96d2590ee5adc67",
        name: "navbar root",
        type: "animbox",
        sx: {
          position: "relative",
          zIndex: 3,
          bgcolor: "neutral2.main",
          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          justifyContent: "space-between",
          height: 64
        },
        children: [
          "690d2f77f96d2590ee5adc64"
        ],
        order: 0,
        createdAt: "2025-11-06T23:32:19.903Z",
        updatedAt: "2025-11-06T23:45:20.249Z",
        __v: 0,
        data: {
          animationObject: {
            entranceAnimation: "animate__fadeIn",
            exitAnimation: "animate__fadeOut",
            isEntering: true
          }
        }
      },
      {
        _id: "690d41c85bd6b934f77e2ddb",
        name: "navbar menu home link",
        type: "internallink",
        data: {
          text: "Home",
          animationObject: {
            entranceAnimation: "animate__zoomIn",
            exitAnimation: "animate__zoomOut",
            isEntering: true,
            delay: 0.25
          },
          action: {
            type: "internalNav",
            pageLinkId: "690cff5f615e38cf06d1c538"
          }
        },
        sx: {
          cursor: "pointer",
          color: "$theme.neutral.content",
          transition: "color 0.2s ease",
          ml: {
            xs: 0,
            md: 3
          },
          mb: {
            xs: 3,
            md: 0
          },
          "&:hover": { 
            color: "$theme.primary.main"
          }
        },
        children: [],
        order: 0,
        createdAt: "2025-11-07T00:48:08.733Z",
        updatedAt: "2025-11-08T17:37:04.826Z",
        __v: 0
      },
      {
        _id: "690e1d235bd6b934f77e303d",
        name: "navbar menu docs link",
        type: "internallink",
        data: {
          text: "Documentation",
          action: {
            type: "externalNav",
            url: "https://google.com"
          },
          animationObject: {
            entranceAnimation: "animate__zoomIn",
            exitAnimation: "animate__zoomOut",
            isEntering: true,
            delay: 0.5
          }
        },
        sx: {
          cursor: "pointer",
          color: "$theme.neutral.content",
          transition: "color 0.2s ease",
          ml: {
            xs: 0,
            md: 3
          },
          mb: {
            xs: 3,
            md: 0
          },
          "&:hover": { 
            color: "$theme.primary.main"
          }
        },
        children: [],
        order: 0,
        createdAt: "2025-11-07T16:24:03.187Z",
        updatedAt: "2025-11-08T17:37:41.106Z",
        __v: 0
      },
      {
        _id: "690e23fef3f8484e3f40139b",
        name: "footer right section text",
        type: "typography",
        data: {
          variant: "body2",
          text: "Powered by Rkitech"
        },
        children: [],
        order: 0,
        createdAt: "2025-11-07T16:53:18.505Z",
        updatedAt: "2025-11-08T18:04:02.649Z",
        __v: 0,
        sx: {
          color: "$theme.neutral.content"
        }
      },
      {
        _id: "690e24a4f3f8484e3f40139d",
        name: "footer right section container",
        type: "box",
        data: {
          variant: "body2",
          text: "Powered by Rkitech"
        },
        sx: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          mt: {
            xs: 4,
            md: 0
          }
        },
        children: [
          "690e23fef3f8484e3f40139b"
        ],
        order: 1,
        createdAt: "2025-11-07T16:56:04.427Z",
        updatedAt: "2025-11-07T16:56:04.427Z",
        __v: 0
      },
      {
        _id: "690e25a6f3f8484e3f4013a0",
        name: "footer menu home link",
        type: "internallink",
        data: {
          text: "Home",
          animationObject: {
            entranceAnimation: "animate__zoomIn",
            exitAnimation: "animate__zoomOut",
            isEntering: true,
            delay: 0.25
          },
          action: {
            type: "internalNav",
            pageLinkId: "690cff5f615e38cf06d1c538"
          }
        },
        sx: {
          cursor: "pointer",
          color: "$theme.neutral.content",
          transition: "color 0.2s ease",
          "&:hover": { 
            color: "$theme.primary.main"
          }
        },
        children: [],
        order: 0,
        createdAt: "2025-11-07T17:00:22.542Z",
        updatedAt: "2025-11-07T17:28:17.637Z",
        __v: 0
      },
      {
        _id: "690e25edf3f8484e3f4013a2",
        name: "footer menu docs link",
        type: "internallink",
        data: {
          text: "Documentation",
          action: {
            type: "externalNav",
            url: "https://google.com"
          },
          animationObject: {
            entranceAnimation: "animate__zoomIn",
            exitAnimation: "animate__zoomOut",
            isEntering: true,
            delay: 0.5
          }
        },
        sx: {
          cursor: "pointer",
          color: "$theme.neutral.content",
          transition: "color 0.2s ease",
          mr: 3,
          "&:hover": { 
            color: "$theme.primary.main"
          }
        },
        children: [],
        order: 1,
        createdAt: "2025-11-07T17:01:33.134Z",
        updatedAt: "2025-11-07T17:23:11.970Z",
        __v: 0
      },
      {
        _id: "690e26d6f3f8484e3f4013a4",
        name: "footer primary menu container",
        type: "box",
        sx: {
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 3
        },
        children: [
          "690e25a6f3f8484e3f4013a0 ",
          "690e25edf3f8484e3f4013a2 "
        ],
        order: 0,
        createdAt: "2025-11-07T17:05:26.970Z",
        updatedAt: "2025-11-07T17:05:26.970Z",
        __v: 0
      },
      {
        _id: "690e2741f3f8484e3f4013a6",
        name: "footer aux menu copyright text",
        type: "typography",
        data: {
          variant: "body2",
          text: "© 2025 Rkitech all rights reserved"
        },
        children: [],
        order: 0,
        createdAt: "2025-11-07T17:07:13.074Z",
        updatedAt: "2025-11-08T18:04:32.344Z",
        __v: 0,
        sx: {
          color: "$theme.neutral.content"
        }
      },
      {
        _id: "690e2849f3f8484e3f4013aa",
        name: "footer aux menu privacy policy link",
        type: "internallink",
        data: {
          text: "Privacy Policy",
          animationObject: {
            entranceAnimation: "animate__zoomIn",
            exitAnimation: "animate__zoomOut",
            isEntering: true,
            delay: 0.25
          },
          action: {
            type: "internalNav",
            pageLinkId: "690cff5f615e38cf06d1c53e"
          }
        },
        sx: {
          cursor: "pointer",
          color: "$theme.neutral.content",
          transition: "color 0.2s ease",
          ml: 1,
          "&:hover": { 
            color: "$theme.primary.main"
          }
        },
        children: [],
        order: 1,
        createdAt: "2025-11-07T17:11:37.090Z",
        updatedAt: "2025-11-07T17:29:12.585Z",
        __v: 0
      },
      {
        _id: "690e28b3f3f8484e3f4013ac",
        name: "footer aux menu container",
        type: "box",
        sx: {
          display: "flex",
          alignItems: "center",
          mt: 3
        },
        children: [
          "690e2741f3f8484e3f4013a6",
          "690e2d85f3f8484e3f40143b",
          "690e2849f3f8484e3f4013aa"
        ],
        order: 1,
        createdAt: "2025-11-07T17:13:23.499Z",
        updatedAt: "2025-11-07T17:34:45.732Z",
        __v: 0
      },
      {
        _id: "690e291df3f8484e3f4013ae",
        name: "footer left side container",
        type: "box",
        sx: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between"
        },
        children: [
          "690e26d6f3f8484e3f4013a4",
          "690e28b3f3f8484e3f4013ac"
        ],
        order: 0,
        createdAt: "2025-11-07T17:15:09.870Z",
        updatedAt: "2025-11-07T17:15:09.870Z",
        __v: 0
      },
      {
        _id: "690e29f0f3f8484e3f4013b0",
        name: "footer root",
        type: "animbox",
        data: {
          component: "footer",
          animationObject: {
            entranceAnimation: "animate__fadeIn",
            exitAnimation: "animate__fadeOut",
            isEntering: true
          }
        },
        sx: {
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row"
          },
          flexWrap: "wrap",
          width: "100%",
          minHeight: "150px",
          bgcolor: "$theme.neutral3.main",
          color: "$theme.neutral3.content",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 -2px 4px rgba(0,0,0,0.15)",
          boxSizing: "border-box",
          p: 4
        },
        children: [
          "690e291df3f8484e3f4013ae",
          "690e23fef3f8484e3f40139b"
        ],
        order: 0,
        createdAt: "2025-11-07T17:18:40.783Z",
        updatedAt: "2025-11-07T17:18:40.783Z",
        __v: 0
      },
      {
        _id: "690e2d85f3f8484e3f40143b",
        name: "footer aux menu divider text",
        type: "typography",
        data: {
          text: "|",
          color: "$theme.primary.main"
        },
        sx: {
          ml: 1
        },
        children: [],
        order: 0,
        createdAt: "2025-11-07T17:33:57.920Z",
        updatedAt: "2025-11-07T17:33:57.920Z",
        __v: 0
      },
      {
        _id: "690f73333235cfb5a27e2653",
        name: "navbar hamburger button",
        type: "iconbutton",
        data: {
          icon: "menu",
          action: [
            {
              type: "openDrawer",
              orientation: "right",
              screenPercentage: 50,
              entrance: "animate__slideInRight",
              exit: "animate__slideOutRight",
              backgroundColor: "$theme.neutral.main",
              childrenElementIds: [
                "690f83c73235cfb5a27e280d",
                "690f841b3235cfb5a27e280f"
              ]
            }
          ]
        },
        sx: {
          display: {
            xs: "flex",
            md: "none"
          },
          color: "$theme.neutral.content"
        },
        children: [],
        order: 1,
        createdAt: "2025-11-08T16:43:31.602Z",
        updatedAt: "2025-11-08T17:55:59.013Z",
        __v: 0
      },
      {
        _id: "690f83c73235cfb5a27e280d",
        name: "mobile navbar menu home link",
        type: "internallink",
        data: {
          text: "Home",
          action: {
            type: "internalNav",
            pageLinkId: "690cff5f615e38cf06d1c538"
          }
        },
        sx: {
          cursor: "pointer",
          color: "$theme.neutral.content",
          transition: "color 0.2s ease",
          mb: 3,
          "&:hover": { 
            color: "$theme.primary.main"
          }
        },
        children: [],
        order: 0,
        createdAt: "2025-11-08T17:54:15.036Z",
        updatedAt: "2025-11-08T17:54:15.036Z",
        __v: 0
      },
      {
        _id: "690f841b3235cfb5a27e280f",
        name: "mobile navbar menu docs link",
        type: "internallink",
        data: {
          text: "Documentation",
          action: {
            type: "externalNav",
            url: "https://google.com"
          }
        },
        sx: {
          cursor: "pointer",
          color: "$theme.neutral.content",
          transition: "color 0.2s ease",
          mb: 3,
          "&:hover": { 
            color: "$theme.primary.main"
          }
        },
        children: [],
        order: 0,
        createdAt: "2025-11-08T17:55:39.019Z",
        updatedAt: "2025-11-08T17:55:39.019Z",
        __v: 0
      },
      {
        _id: "6910c4cd8f42818c65d16160",
        name: "admin panel logout button",
        type: "button",
        data: {
          text: "Logout",
          variant: "outlined",
          action: {
            type: "handleLogout",
            pageLinkId: "69124ccbd79202521bba5f87"
          }
        },
        sx: {
          backgroundColor: "$theme.primary.main",
          color: "$theme.primary.content",
          fontWeight: 600,
          py: 1.2,
          mt: 1,
          width: "100%",
          borderRadius: "10px",
          border: "1px solid transparent",
          "&:hover": { 
            backgroundColor: "$theme.neutral.main",
            color: "$theme.primary.main",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "$theme.primary.main"
          }
        },
        children: [],
        order: 0,
        createdAt: "2025-11-09T16:43:57.897Z",
        updatedAt: "2025-11-12T19:57:22.338Z",
        __v: 0
      },
      {
        _id: "6910c53c8f42818c65d16162",
        name: "admin panel logout container",
        type: "box",
        children: [
          "6910c4cd8f42818c65d16160"
        ],
        order: 0,
        createdAt: "2025-11-09T16:45:48.500Z",
        updatedAt: "2025-11-09T16:45:48.500Z",
        __v: 0
      },
      {
        _id: "6910c57a8f42818c65d16164",
        name: "admin panel menu container",
        type: "box",
        sx: {
          flexGrow: 1
        },
        children: [
          "691234e2328e6de71c547f1c"
        ],
        order: 0,
        createdAt: "2025-11-09T16:46:50.170Z",
        updatedAt: "2025-11-10T18:54:39.510Z",
        __v: 0
      },
      {
        _id: "6910c5b88f42818c65d16166",
        name: "admin panel menu container",
        type: "box",
        sx: {
          display: "flex",
          flexDirection: "column",
          height: "100%"
        },
        children: [
          "6910c57a8f42818c65d16164",
          "6910c53c8f42818c65d16162"
        ],
        order: 0,
        createdAt: "2025-11-09T16:47:52.125Z",
        updatedAt: "2025-11-09T16:47:52.125Z",
        __v: 0
      },
      {
        _id: "691234e2328e6de71c547f1c",
        name: "admin menu profile link",
        type: "internallink",
        data: {
          text: "Profile",
          action: {
            type: "internalNav",
            pageLinkId: "691234c7328e6de71c547f1a"
          }
        },
        sx: {
          cursor: "pointer",
          color: "$theme.neutral.content",
          transition: "color 0.2s ease",
          mb: 3,
          "&:hover": { 
            color: "$theme.primary.main"
          }
        },
        children: [],
        order: 0,
        createdAt: "2025-11-10T18:54:26.116Z",
        updatedAt: "2025-11-10T18:54:26.116Z",
        __v: 0
      }
    ]
  }
];

seedDatabase<IElements>({
  modelName: 'elements',
  model: Elements,
  data: defaultElementss,
  uniqueField: 'type',
  displayField: 'type',
});