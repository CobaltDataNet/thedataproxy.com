import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Text,
  VStack,
  Button,
  Divider,
  Flex,
  Switch,
  List,
  ListItem,
  Select,
  Alert,
  AlertIcon,
  HStack,
  Input,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import PromoSERP from "../../../components/PromoSERP"; // ✅ Import PromoSERP

export const Route = createFileRoute("/_layout/scraping-api/explore")({
  component: Explore,
});

function Explore() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);

  if (!currentUser) {
    return (
      <Container maxW="full">
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Text>Loading user data...</Text>
        </Alert>
      </Container>
    );
  }

  // ✅ Subscription & Trial State
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("name");

  const ownedApis = currentUser?.ownedApis || [];
  const isLocked = !hasSubscription && !isTrial;
  const isTrialMode = isTrial && !hasSubscription; // ✅ Trial Mode: Grey out everything except search

  // 🔍 Mock API Data
  const proxyProducts = [
    { id: "google", name: "Google Search API", type: "search", owned: ownedApis.includes("google"), description: "Fetches real-time search results from Google." },
    { id: "bing", name: "Bing Search API", type: "search", owned: ownedApis.includes("bing"), description: "Provides search results from Bing, including images and news." },
    { id: "real-estate", name: "Real Estate Data API", type: "real estate", owned: ownedApis.includes("real-estate"), description: "Get property listings, pricing trends, and real estate analytics." },
    { id: "finance", name: "Financial Data API", type: "finance", owned: ownedApis.includes("finance"), description: "Access stock market trends, forex rates, and economic indicators." },
  ];

  const industries = ["All", "Owned", ...new Set(proxyProducts.map(api => api.type))];

  // 🔄 Filtered List Logic
  const filteredProducts = useMemo(() => {
    return proxyProducts.filter((product) => {
      const matchesFilter = activeFilter === "all" || product.type.toLowerCase() === activeFilter.toLowerCase();
      const matchesOwned = !ownedOnly || product.owned;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesOwned && matchesSearch;
    });
  }, [searchQuery, ownedOnly, activeFilter]);

  return (
    <Container maxW="full">
      {/* 🔄 Title with Debug Toggles */}
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Explore APIs</Heading>

        {/* Debugging Toggles (Moved to Title Row) */}
        <HStack spacing={6}>
          <HStack>
            <Text fontWeight="bold">Subscription:</Text>
            <Switch isChecked={hasSubscription} onChange={() => setHasSubscription(!hasSubscription)} />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Trial Mode:</Text>
            <Switch isChecked={isTrial} onChange={() => setIsTrial(!isTrial)} />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Deactivated:</Text>
            <Switch isChecked={isDeactivated} onChange={() => setIsDeactivated(!isDeactivated)} />
          </HStack>
        </HStack>
      </Flex>

      <Divider my={4} />

      {/* 🚨 Show PromoSERP Inside the Component When Locked */}
      {isLocked ? (
        <PromoSERP />
      ) : (
        <>
          {/* ✅ Display Subscription Info */}
          {hasSubscription && (
            <Alert status="success" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text>
                ✅ You have an active subscription. Enjoy full access to all APIs!
              </Text>
            </Alert>
          )}

          {/* 🛠 API Explorer - Trial Mode: Greyed Out Except Search */}
          <Flex mt={6} gap={4} justify="space-between" align="center" flexWrap="wrap">
            <Input placeholder="Search APIs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} w={{ base: "100%", md: "300px" }} />
            
            {/* Filters & Sorting Disabled in Trial Mode */}
            <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} w="200px" isDisabled={isTrialMode}>
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </Select>
          </Flex>

          <Stack direction="row" spacing={3} mt={4}>
            {industries.map((type) => (
              <Button 
                key={type} 
                size="md" 
                fontWeight="bold" 
                borderRadius="full" 
                colorScheme={activeFilter === type.toLowerCase() ? "blue" : "gray"} 
                variant={activeFilter === type.toLowerCase() ? "solid" : "outline"} 
                onClick={() => setActiveFilter(type.toLowerCase())} 
                isDisabled={isTrialMode} // ✅ Greyed out in Trial Mode
              >
                {type}
              </Button>
            ))}
          </Stack>

          <Divider my={4} />

          <VStack spacing={6} mt={6} align="stretch">
            {filteredProducts.length === 0 ? (
              <Text textAlign="center" fontSize="lg" color="gray.500">No APIs match this filter.</Text>
            ) : (
              <List spacing={4}>
                {filteredProducts.map((api) => (
                  <ListItem key={api.id}>
                    <Text fontWeight="bold">{api.name}</Text>
                    <Text fontSize="sm" color="gray.600">{api.description}</Text>
                  </ListItem>
                ))}
              </List>
            )}
          </VStack>
        </>
      )}
    </Container>
  );
}

export default Explore;
