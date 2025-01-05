'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toaster, Toaster } from '@/components/ui/toaster';
import { Skeleton, SkeletonCircle, SkeletonText } from '@/components/ui/skeleton';
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
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [subscriberSettings, setSubscriberSettings] = useState({
    unsubscribeToMarketingEmails: false,
    unsubscribeToAllEmails: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = searchParams.get('userId') || '';

        console.log({ userId });

        await toaster.promise(
          new Promise((resolve) => {
            setTimeout(() => {
              setLoading(false);
              resolve(true);
              setSubscriberSettings({
                ...subscriberSettings,
                unsubscribeToMarketingEmails: false,
                unsubscribeToAllEmails: true,
              });
            }, 5000);
          }),
          {
            loading: {
              title: 'Loading your subscription status...',
              description: 'Please wait...',
            },
            success: {
              title: 'Update successful',
              description: 'Your subscription status has been updated.',
              action: {
                label: 'Undo',
                onClick: () => {
                  setSubscriberSettings({
                    ...subscriberSettings,
                    unsubscribeToAllEmails: false,
                  });
                },
              },
            },
            error: {
              title: 'Error',
              description: 'Failed to load subscription status',
            },
          }
        );
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxW="lg">
      <Toaster />
      <Flex mt="8" h="100%" align="center" justify="center">
        <Card.Root variant="subtle" width="full">
          {loading ? (
            <Card.Body>
              <Box mb="8">
                <SkeletonText noOfLines={2} />
              </Box>
              <Skeleton height="200px" />
            </Card.Body>
          ) : (
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
                    Unsubscribe to marketing emails
                  </Text>
                  <Switch
                    size="lg"
                    checked={subscriberSettings.unsubscribeToMarketingEmails}
                    onCheckedChange={({ checked }) => {
                      setSubscriberSettings({
                        ...subscriberSettings,
                        unsubscribeToMarketingEmails: checked,
                      });
                    }}
                  />
                </Flex>

                <Flex align="center" justify="space-between">
                  <Text fontSize="sm" fontWeight="semibold" color="muted">
                    Unsubscribe to all emails
                  </Text>
                  <Switch
                    size="lg"
                    checked={subscriberSettings.unsubscribeToAllEmails}
                    onChange={(e) =>
                      setSubscriberSettings({
                        ...subscriberSettings,
                        unsubscribeToAllEmails: e.target.checked,
                      })
                    }
                  />
                </Flex>
              </Stack>
            </Card.Body>
          )}

          <Card.Footer>
            <Flex align="center" justify="center" gap="1" width="full">
              <Text fontSize="xs" fontWeight="normal" color="muted">
                Powered By:
              </Text>
              <Text fontSize="xs" fontWeight="bold">
                <Link variant="underline" href="https://www.realmlabs.co/" colorPalette="blue">
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
