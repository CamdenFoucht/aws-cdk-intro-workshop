import { Construct, Stack, StackProps, SecretValue } from '@aws-cdk/core';
import { TheCdkWorkshopStage } from './cdkworkshop.com';
import { CodePipeline, ShellStep, CodePipelineSource } from '@aws-cdk/pipelines';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    const source = CodePipelineSource.gitHub('CamdenFoucht/aws-cdk-intro-workshop', 'master', {
      authentication: SecretValue.secretsManager("github-token")
    });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new ShellStep('Synth', {
        input: source,
        primaryOutputDirectory: "cdkworkshop.com/cdk.out",
        commands: [
          "cd cdkworkshop.com",
          "npm ci && tar -C /usr/local/bin -xzf hugo/hugo_*_Linux-64bit.tar.gz hugo",
          "npm run build",
          "npx cdk synth"
      ]
      })
    })


    pipeline.addStage(new TheCdkWorkshopStage(this, 'Prod'));
  }
}
