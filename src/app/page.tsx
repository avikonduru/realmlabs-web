'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toaster } from '@/components/ui/toaster';
import {
  Container,
  Card,
  Text,
  Center,
  Box,
  Flex,
  Stack,
  StackSeparator,
  Link,
} from '@chakra-ui/react';

const HomwPage = () => {
  return (
    <Container maxW="lg">
      <Flex mt="8" h="100%" align="center" justify="center">
        <Card.Root variant="subtle" width="full">
          <Card.Body>
            <Box mb="8">
              <Card.Title>Hi avikonduru@gmail.com,</Card.Title>
              <Card.Description fontSize="sm" color="muted">
                Manage your subscriptions
              </Card.Description>
            </Box>

            <Stack separator={<StackSeparator />} gap="4">
              <Flex align="center" justify="space-between">
                <Text fontSize="sm" fontWeight="semibold" color="muted">
                  Monthly
                </Text>
                <Switch size="lg" />
              </Flex>

              <Flex align="center" justify="space-between">
                <Text fontSize="sm" fontWeight="semibold" color="muted">
                  Monthly
                </Text>
                <Switch size="lg" />
              </Flex>

              <Flex align="center" justify="space-between">
                <Text fontSize="sm" fontWeight="semibold" color="muted">
                  Monthly
                </Text>
                <Switch size="lg" />
              </Flex>
            </Stack>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('clicked');
                toaster.success({
                  title: 'Update successful',
                  description: 'File saved successfully to the server',
                  action: {
                    label: 'Undo',
                    onClick: () => console.log('Undo'),
                  },
                });
              }}
            >
              Click me
            </Button>
          </Card.Body>

          <Card.Footer>
            <Flex align="center" justify="center" gap="1" width="full">
              <Text fontSize="xs" fontWeight="normal" color="muted">
                Powered By:
              </Text>
              <Text fontSize="xs" fontWeight="bold">
                <Link variant="underline" href="https://chakra-ui.com" colorPalette="blue">
                  Realm Labs
                </Link>
              </Text>
            </Flex>
          </Card.Footer>
        </Card.Root>
      </Flex>
    </Container>
  );
};

export default HomwPage;
