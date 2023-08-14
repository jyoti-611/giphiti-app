import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
  useClientRouting,
  useRoutePropagation,
} from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Provider } from "react-redux";
import store from "./store";
import Layout from "./components/Layout";
import { Link as ReactRouterLink } from "react-router-dom";

function isOutboundLink(url) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/.test(url);
}

function Link({ children, url = "", ...rest }) {
  if (isOutboundLink(url) || rest.download) {
    return (
      <a to={url} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <ReactRouterLink to={url} {...rest}>
      {children}
    </ReactRouterLink>
  );
}

function MyRouter() {
  const navigate = useNavigate();

  // Adapt between the new navigation API and the old history API that app-bridge expects
  const history = useMemo(() => {
    return {
      replace: (path) => navigate(path, { replace: true }),
    };
  }, []);

  useClientRouting(history);

  return null;
}

function MyRoutes({ location }) {
  useRoutePropagation(location);

  return (
    <Provider store={store}>
      <Layout>
        <Routes>
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
        </Routes>
      </Layout>
    </Provider>
  );
}

function App() {
  return (
    <PolarisProvider i18n={translations} linkComponent={Link}>
      <AppBridgeProvider
        config={{
          apiKey: process.env.SHOPIFY_API_KEY,
          host: new URL(location.href).searchParams.get("host"),
          forceRedirect: true,
        }}
      >
        <MyProvider>
          <MyRouter />
          <MyRoutes />
        </MyProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function MyProvider({ children }) {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);
    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      console.log("....", Redirect.Action.APP, redirect);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);

      return null;
    }

    return response;
  };
}
