export interface SlackWebhookPayload {
  api_app_id: string;
  channel_id: string;
  channel_name: string;
  command: string;
  is_enterprise_install: boolean;
  response_url: string;
  team_domain: string;
  team_id: string;
  text: string;
  token: string;
  trigger_id: string;
  user_id: string;
  user_name: string;
}
