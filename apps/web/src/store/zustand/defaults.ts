import { UserProfile, Settings, ChatMessage, JobApplication } from '@/lib/types';
import defaultsData from './defaults.json';

export const defaultUser = defaultsData.defaultUser as UserProfile;
export const defaultSettings = defaultsData.defaultSettings as Settings;
export const initialChats = defaultsData.initialChats as ChatMessage[];
export const initialApplications = defaultsData.initialApplications as JobApplication[];

