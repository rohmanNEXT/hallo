'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/ui/select-custom';
import { useModeration } from '../context';
import api from '@/lib/api';
import { LuChevronLeft as ChevronLeft, LuChevronRight as ChevronRight } from 'react-icons/lu';

const AiConfigPage: React.FC = () => {
  const { aiConfig, setAiConfig, showToast } = useModeration();

  const activeProvider = aiConfig.activeProvider;
  const activeConfig = aiConfig.providers[activeProvider] || { apiKey: '', model: '' };

  const handleProviderChange = (val: string) => {
    setAiConfig({
      ...aiConfig,
      activeProvider: val,
    });
  };

  const handleModelChange = (modelVal: string) => {
    setAiConfig({
      ...aiConfig,
      providers: {
        ...aiConfig.providers,
        [activeProvider]: {
          ...activeConfig,
          model: modelVal,
        },
      },
    });
  };

  const handleKeyChange = (keyVal: string) => {
    setAiConfig({
      ...aiConfig,
      providers: {
        ...aiConfig.providers,
        [activeProvider]: {
          ...activeConfig,
          apiKey: keyVal,
        },
      },
    });
  };

  const handleSaveSettings = async () => {
    try {
      const { data } = await api.post('/ai-config', aiConfig);
      showToast(
        `Konfigurasi untuk ${activeProvider} berhasil disimpan!`,
        'success',
      );
    } catch (error) {
      console.error('Error saving AI configuration:', error);
      showToast('Gagal menyimpan konfigurasi AI!', 'error');
    }
  };

  const pageContent = (
    <div className="space-y-6">
      <Card className="h-[960px] border border-border bg-card rounded-3xl overflow-hidden">
        <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full space-y-4">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-left">
            {/* Unified Title & Actions Row */}
            <div className="pb-4 border-b shrink-0 mb-4 flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2 uppercase">
                  AI Configuration
                </span>
              </div>
            </div>

            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1.5">
                  Provider (7 Available)
                </label>
                <CustomSelect
                  value={activeProvider}
                  onChange={handleProviderChange}
                  options={[
                    { value: 'OpenRouter', label: 'OpenRouter' },
                    { value: 'MaimaRouter', label: 'MaimaRouter' },
                    { value: 'ChatGpt', label: 'ChatGpt' },
                    { value: 'Gemini', label: 'Gemini' },
                    { value: 'claude', label: 'claude' },
                    { value: 'deepseek', label: 'deepseek' },
                    { value: 'kimi', label: 'kimi' },
                  ]}
                  className="h-10 text-sm text-foreground bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1.5">
                  Text Model untuk {activeProvider}
                </label>
                <Input
                  value={activeConfig.model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="rounded-xl border-border bg-background text-sm h-10 text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1.5">
                  API Key untuk {activeProvider}
                </label>
                <Input
                  type="password"
                  value={activeConfig.apiKey}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  className="rounded-xl border-border bg-background text-sm h-10 text-foreground"
                />
                <p className="text-[12px] text-muted-foreground mt-1.5">
                  *Kunci API untuk {activeProvider} dienkripsi secara aman di sisi server.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-start">
              <Button
                className="rounded-xl font-bold h-10 px-6 shadow-sm"
                onClick={handleSaveSettings}
              >
                Simpan Pengaturan
              </Button>
            </div>
          </div>

          {/* Pagination for visual consistency on settings page */}
          <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-border/40 text-xs flex-none">
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 border border-border/60 text-xs font-semibold opacity-50 cursor-not-allowed"
                disabled
              >
              <ChevronLeft className="h-4 w-4" />
            </Button>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  className="h-9 w-9 text-xs font-bold transition-all rounded-lg cursor-not-allowed shadow-sm bg-foreground text-background border-foreground"
                  disabled
                >
                  1
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 border border-border/60 text-xs font-semibold opacity-50 cursor-not-allowed"
                disabled
              >
              <ChevronRight className="h-4 w-4" />
            </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return pageContent;
};

export default AiConfigPage;
