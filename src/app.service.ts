import { Injectable } from '@nestjs/common';
import { ChildProcess, exec } from 'child_process';


export const appId: string = '8fab9a83226540a081559b89970d81ee';
export const appliteDir: string = '/home/code/Agora_Recording/bin';

@Injectable()
export class AppService {

    processDic: any = {};

    root(): string {
        return 'Hello World!';
    }

    /**
     * 开始录制
     * @param channelId
     */
    startRecord(channelId: string): any {

        if (!channelId) {
            return {
                code: -1,
                msg: '开始录制参数错误',
            };
        }

        let oldProcess: ChildProcess = this.processDic[channelId];
        //进程已存在
        if (!!oldProcess) {
            //判断进程是否关闭
            if (!oldProcess.killed) {
                return { code: -1, msg: '录制已开始' };
            }
        }

        //关闭进程
        this.stopRecord(channelId);


        let recordCommandStr = `/home/code/Agora_Recording/samples/cpp/recorder_local --appId ${appId} --uid 0 --channel ${channelId} --appliteDir ${appliteDir} --isMixingEnable 1 --mixedVideoAudio 1 &`;

        let process: ChildProcess = exec(recordCommandStr, (error: Error | null, stdout: string, stderr: string) => {
            console.log(`stdout:${stdout}`);
            console.log(`stderr:${stderr}`);
            console.log(`channel:${channelId} record is start`);
        });

        process.addListener("error",(err:Error)=>{
            console.log(`process error:${err.message}`);
        });
        process.addListener('exit', (code: number, signal: string) => {
            console.log(`process exit code:${code} signal:${signal}`);
        });
        process.addListener('close', (code: number, signal: string) => {
            console.log(`process close code:${code} signal:${signal}`);
        });


        this.processDic[channelId] = process;

        return {
            code: 0,
            msg: '开始录制',
        };
    }

    /**
     * 停止录制
     * @param channelId
     */
    stopRecord(channelId: string): any {
        if (!channelId) {
            return {
                code: -1,
                msg: '停止录制参数错误',
            };
        }

        let process: ChildProcess = this.processDic[channelId];
        if (!process) {
            return {
                code: -1,
                msg: '录制channel不存在',
            };

        }
        //杀掉进程
        if (process && !process.killed) {
            process.kill();
            process.removeAllListeners();
        }

        //删除channelId
        delete this.processDic[channelId];

        return {
            code: 0,
            msg: '录制已停止',
        };
    }

}
