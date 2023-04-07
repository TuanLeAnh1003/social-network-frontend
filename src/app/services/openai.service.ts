import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private readonly appName = 'client';
  private readonly appVersion = '0.0.0';
  private readonly httpClientName = 'Angular HttpClient';
  private readonly httpClientVersion = '12.0.0';
  private readonly angularVersion = '12.0.0';

  private openai: OpenAIApi;
  configuration = new Configuration({
    apiKey: "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",
  });

  constructor() {
    this.openai = new OpenAIApi(this.configuration);
  }

  async generateText(prompt: string): Promise<string | undefined> {
    try {
      const response = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 256
      }, {
        headers: {
          'User-Agent': `${this.appName}/${this.appVersion} (${this.httpClientName}/${this.httpClientVersion}; Angular/${this.angularVersion})`
        }
      });
      return response.data.choices[0].text;
    } catch (error:any) {
      console.error(`Error generating text: ${error.message}`);
      return undefined;
    }
  }

}
