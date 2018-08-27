import { Injectable, HttpService } from '@nestjs/common';
import { ChildProcess, exec } from 'child_process';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';


export const appId: string = '8fab9a83226540a081559b89970d81ee';
export const appliteDir: string = '/home/code/Agora_Recording/bin';

export interface ProcessDicValue {
    process: ChildProcess;
    recordPath?: string;
}


@Injectable()
export class AppService {

    processDic: { [key: string]: ProcessDicValue } = {};

    constructor(private readonly httpService: HttpService) {

    }

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

        let dicValue: ProcessDicValue = this.processDic[channelId];

        let oldProcess: ChildProcess = dicValue.process;
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
            // console.log(`stdout:${stdout}`);
            // console.log(`stderr:${stderr}`);
            // console.log(`channel:${channelId} record is start`);
            if (stdout) {
                let outArr = stdout.trim().split('\n');
                outArr.forEach((value: string) => {
                    console.log('value:', value);
                    if (value.indexOf('Recording') >= 0) {
                        let matchArr = value.match(/Recording directory is .(\S*)/);
                        if (matchArr && matchArr.length > 1) {
                            console.log('matchArr[1]:', matchArr[1]);
                            let relativePath: string = matchArr[1];//相对路径
                            let videoParentName: string = rPath.split('/')[2];//获取视频的父级目录名
                            let cId = videoParentName.substring(0, videoParentName.indexOf('_'));//频道名称
                            let dv = this.processDic[cId];
                            if (dv) {
                                dv.recordPath = relativePath;//赋值录制路径
                            }
                        }
                    }
                });
            }
        });


        process.addListener('close', (code: number, signal: string) => {
            console.log(`process close code:${code} signal:${signal}`);

        });


        console.log(process.pid);

        this.processDic[channelId] = { process };

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

        let process: ChildProcess = this.processDic[channelId].process;
        if (!process) {
            return {
                code: -1,
                msg: '录制channel不存在',
            };

        }
        //杀掉进程
        if (process && !process.killed) {
            //https://segmentfault.com/q/1010000012728403
            let realProcessPid: number = process.pid + 1;
            process.kill();
            exec(`kill ${realProcessPid}`);
        }

        console.log('stopRecord, recordPath: ', this.processDic[channelId].recordPath);

        //删除channelId
        delete this.processDic[channelId];

        return {
            code: 0,
            msg: '录制已停止',
        };
    }

    getUploadInfo() {
        let url = 'http://netschool.qinyixue.xin/Api/Curriculum/GetUploadInfo';
        let fileName = 'test.mp4';
        let curriculumID = 'FEBCEC8B-990F-4C92-925E-430DEB7C508B';
        return this.httpService.get(url, {
            params: {
                fileName: fileName,
                curriculumID: curriculumID,
            },
        }).pipe(
            map((value: AxiosResponse) => {
                return value.data;
            }),
        );
    }

    /*
    getPublicData() {
        http://vod.cn-shanghai.aliyuncs.com/
                ?Format=json
            &Version=2017-03-21
            &Signature=vpEEL0zFHfxXYzSFV0n7%2FZiFL9o%3D
        &SignatureMethod=Hmac-SHA1
        &SignatureNonce=9166ab59-f445-4005-911d-664c1570df0f
        &SignatureVersion=1.0
        &Action=GetVideoPlayAuth
        &AccessKeyId=tkHh5O7431CgWayx
        &Timestamp=2017-03-29T09%3A22%3A32Z;

        let url = 'http://vod.cn-shanghai.aliyuncs.com';
        let Format = 'json';
        let Signature
    }
    */

}
