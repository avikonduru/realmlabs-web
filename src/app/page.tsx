'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// config
import { supabase } from '@/configs/supabase';

import { Switch } from '@/components/ui/switch';
import { toaster, Toaster } from '@/components/ui/toaster';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Container, Card, Text, Box, Flex, Stack, StackSeparator, Link } from '@chakra-ui/react';

interface UserData {
  created_at: string;
  email: string;
  uuid: string;
}

function SubscriptionManager() {
  const searchParams = useSearchParams();
  const [subscriberSettings, setSubscriberSettings] = useState({
    unsubscribeToMarketingEmails: false,
    unsubscribeToAllEmails: false,
  });
  const [userData, setUserData] = useState<UserData | null>(null);

  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = searchParams.get('userId') || '';

        await toaster.promise(
          new Promise(async (resolve, reject) => {
            try {
              const { data: userData, error: userError } = await supabase
                .from('recipients')
                .select('*')
                .eq('uuid', userId)
                .single();
              const { data: subscriptionData, error: subscriptionError } = await supabase
                .from('recipient_subscription_settings')
                .select('*')
                .eq('recipient_id', userId)
                .single();

              console.log({ userData });

              if (userError || subscriptionError) {
                reject();
                setOptionsLoading(false);
              } else if (!userData) {
                reject();
                setOptionsLoading(false);
              } else if (!subscriptionData) {
                reject();
                setOptionsLoading(false);
              } else {
                setUserData(userData);
                setSubscriberSettings((prevSettings) => ({
                  ...prevSettings,
                  unsubscribeToMarketingEmails: true,
                  unsubscribeToAllEmails: subscriptionData?.all_emails_unsub || false,
                }));
                await supabase
                  .from('recipient_subscription_settings')
                  .update({
                    marketing_emails_unsub: true,
                  })
                  .eq('recipient_id', userId);
                setLoading(false);
                resolve(userData);
              }
            } catch (err) {
              console.error(err);
              reject();
              setOptionsLoading(false);
            }
          }),
          {
            loading: {
              title: 'Loading your subscription status',
              description: 'Please wait...',
            },
            success: {
              title: 'Update successful',
              description: 'Your subscription status has been updated.',
              action: {
                label: 'Undo',
                onClick: async () => {
                  setOptionsLoading(true);
                  setSubscriberSettings((prevSettings) => ({
                    ...prevSettings,
                    unsubscribeToMarketingEmails: false,
                  }));
                  await supabase
                    .from('recipient_subscription_settings')
                    .update({
                      marketing_emails_unsub: false,
                    })
                    .eq('recipient_id', userId);
                  setOptionsLoading(false);
                },
              },
            },
            error: () => ({
              title: 'Error',
              description: 'An unexpected error occurred',
            }),
          }
        );
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleSettingsUpdate = async (
    updatedSetting: boolean,
    settingType: string,
    userId: string | undefined
  ) => {
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      setOptionsLoading(true);
      if (settingType === 'marketing_emails_unsub') {
        await supabase
          .from('recipient_subscription_settings')
          .update({
            [settingType]: updatedSetting,
          })
          .eq('recipient_id', userId);
        setOptionsLoading(false);
      } else if (settingType === 'all_emails_unsub') {
        await supabase
          .from('recipient_subscription_settings')
          .update({
            [settingType]: updatedSetting,
          })
          .eq('recipient_id', userId);
        setOptionsLoading(false);
      } else {
        throw new Error('Invalid setting type');
      }
    } catch (error) {
      console.error(error);
      toaster.create({
        title: 'Error',
        description: 'An unexpected error occurred',
        type: 'error',
      });
    }
  };

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
                <Card.Title>Hi {userData?.email || ''},</Card.Title>
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
                    disabled={optionsLoading}
                    checked={subscriberSettings.unsubscribeToMarketingEmails}
                    onCheckedChange={async ({ checked }) => {
                      setSubscriberSettings({
                        ...subscriberSettings,
                        unsubscribeToMarketingEmails: checked,
                      });
                      await handleSettingsUpdate(checked, 'marketing_emails_unsub', userData?.uuid);
                    }}
                  />
                </Flex>

                <Flex align="center" justify="space-between">
                  <Text fontSize="sm" fontWeight="semibold" color="muted">
                    Unsubscribe to all emails
                  </Text>
                  <Switch
                    size="lg"
                    disabled={optionsLoading}
                    checked={subscriberSettings.unsubscribeToAllEmails}
                    onCheckedChange={async ({ checked }) => {
                      setSubscriberSettings({
                        ...subscriberSettings,
                        unsubscribeToAllEmails: checked,
                      });
                      await handleSettingsUpdate(checked, 'all_emails_unsub', userData?.uuid);
                    }}
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
}

export default function HomePage() {
  return (
    <Suspense fallback={<SubscriptionLoadingState />}>
      <SubscriptionManager />
    </Suspense>
  );
}

function SubscriptionLoadingState() {
  return (
    <Container maxW="lg">
      <Flex mt="8" h="100%" align="center" justify="center">
        <Card.Root variant="subtle" width="full">
          <Card.Body>
            <Box mb="8">
              <SkeletonText noOfLines={2} />
            </Box>
            <Skeleton height="200px" />
          </Card.Body>
        </Card.Root>
      </Flex>
    </Container>
  );
}
