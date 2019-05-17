/*
* @author yhwu
* Date at 2018/11/21
* 页面组件
*/
// chrome://flags/#autoplay-policy
import React from 'react';
import { connect } from 'dva';
//import styles from './RenderProps.less';
import audioUrl from '../../../../assets/f_1.mp3';
import { Button } from 'antd'

class Audio extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            baseY: 300
        }
    }

    componentDidMount() {
        this.createWaveArea()
        this.createAudioContext()
        // 监听音频播放
        this.audio.addEventListener('playing', () => {
            this.animate()
        })
    }

    createWaveArea = () => {
        this.canvas = document.getElementById('waveCanvas')
        this.ctx = this.canvas.getContext('2d')
        this.canvas.height = 450;
        this.width = this.canvas.offsetWidth
        this.height = this.canvas.offsetHeight

        this.ctx.beginPath()
        this.ctx.fillStyle = 'rgba(102,102,102, 0.8)'
        this.ctx.moveTo(0, this.state.baseY)
        this.ctx.lineTo(this.width, this.state.baseY)
        this.ctx.lineTo(this.width, this.height)
        this.ctx.lineTo(0, this.height)
        this.ctx.fill()
    }

    createAudioContext = () => {
        this.audioContext = new window.AudioContext()
        this.audio = document.getElementById('audio')
        // 使用audio标签作为音源
        this.source = this.audioContext.createMediaElementSource(this.audio)
        // 创建一个分析器
        this.analyser = this.audioContext.createAnalyser()
        // 串联起分析器节点和音源输出
        this.analyser.connect(this.audioContext.destination)
        this.source.connect(this.analyser)
    }

    animate = () => {
        let con = () => {
            // 从分析器中获取当前播放的频率数据
            let array = new Uint8Array(this.analyser.frequencyBinCount)
            this.analyser.getByteFrequencyData(array)
            this.draw1(array)
            this.timer = requestAnimationFrame(con)
        }
        this.timer = requestAnimationFrame(con)
    }

    draw1 = (array) => {
        this.ctx.clearRect(0, 0, this.width, this.state.baseY)
        // array长度为1024, 总共取10个关键点, 关键点左右两边各取5个点作为过渡, 波浪更自然
        let waveArr1 = [],  waveArr2 = [], waveTemp = [], leftTemp = [], rightTemp = [], waveStep = 20, leftStep = 70, rightStep = 90
        //事先定好要取的点的key,相比下面直接循环整个数组来说效率高很多。
        let waveStepArr = [0, 51, 102, 153, 204, 255, 306, 357, 408];
        let leftStepArr = [70, 141, 212, 283, 354];
        let rightStepArr = [90, 181, 272, 363, 454];
        waveStepArr.map((key) => {
            waveTemp.push(array[key] / 2.6);
        });
        leftStepArr.map((key) => {
            leftTemp.unshift(Math.floor(array[key] / 4.8));
        });
        rightStepArr.map((key) => {
            rightTemp.push(Math.floor(array[key] / 4.8));
        });
        // array.map((data, k) => {
        //     if(waveStep == 50 && waveTemp.length < 9) {
        //         // console.log(k)
        //         waveTemp.push(data / 2.6);
        //         waveStep = 0;
        //     }else{
        //         waveStep ++;
        //     }
        //     if(leftStep == 0 && leftTemp.length < 5) {
        //         leftTemp.unshift(Math.floor(data / 4.8));
        //         leftStep = 70;
        //     }else {
        //         leftStep --;
        //     }
        //     if(rightStep == 0 && rightTemp.length < 5) {
        //         console.log(k)
        //         rightTemp.push(Math.floor(data / 4.8));
        //         rightStep = 90;
        //     }else {
        //         rightStep --;
        //     }
        // });
        waveArr1 = leftTemp.concat(waveTemp).concat(rightTemp);
        waveArr2 = leftTemp.concat(rightTemp);
        waveArr2.map((data, k) => {
            waveArr2[k] = data * 1.8;
        });
        let waveWidth = Math.ceil(this.width / (waveArr1.length - 1));
        let waveWidth2 =  Math.ceil(this.width / (waveArr2.length - 1));
        this.ctx.beginPath()
        this.ctx.fillStyle = 'red' // 'rgba(102,102,102,0.4)'
        this.ctx.moveTo(-waveWidth * 2, this.state.baseY - waveArr1[0])
        for( let i = 1; i < waveArr2.length - 2; i++ ) {
            let p0 = {x: (i - 2) * waveWidth, y: waveArr1[i - 1]};
            let p1 = {x: (i - 1) * waveWidth, y: waveArr1[i]};
            let p2 = {x: (i) * waveWidth, y: waveArr1[i + 1]};
            let p3 = {x: (i + 1) * waveWidth, y: waveArr1[i + 2]};

            for(let j = 0; j < 100; j ++) {
                let t = j * (1.0 / 100);
                let tt = t * t;
                let ttt = tt * t;
                let CGPoint ={};
                CGPoint.x = 0.5 * (2*p1.x+(p2.x-p0.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*tt + (3*p1.x-p0.x-3*p2.x+p3.x)*ttt);
                CGPoint.y = 0.5 * (2*p1.y+(p2.y-p0.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*tt + (3*p1.y-p0.y-3*p2.y+p3.y)*ttt);
                this.ctx.lineTo(CGPoint.x, this.state.baseY - CGPoint.y);
            }
            this.ctx.lineTo(p2.x, this.state.baseY - p2.y);
//            this.ctx.lineTo(i * waveWidth2, this.state.baseY - waveArr2[i])
        }
        this.ctx.lineTo((waveArr1.length) * waveWidth, this.baseY - waveArr1[waveArr1.length - 1])
        this.ctx.lineTo(this.width + waveWidth * 2, this.state.baseY);
        this.ctx.lineTo(this.width + waveWidth * 2, this.height);
        this.ctx.lineTo(-2 * waveWidth, this.height);
//        this.ctx.lineTo(this.width, this.state.baseY)
        this.ctx.fill()

        this.ctx.beginPath()
        this.ctx.fillStyle = 'rgba(102,102,102, 0.8)'
        this.ctx.moveTo(0, this.state.baseY)
        for( let i = 0; i < waveArr1.length; i++ ) {
            this.ctx.lineTo(i * waveWidth, this.state.baseY - waveArr1[i])
        }

        this.ctx.lineTo(this.width, this.state.baseY)
        this.ctx.fill()

    }

    draw = (array) => {
        this.ctx.clearRect(0, 0, this.width, this.state.baseY);
        this.ctx.fillStyle = 'rgba(102,102,102, 0.8)'
        this.ctx.beginPath()
        this.ctx.moveTo(0, this.state.baseY)
        for( let i = 0; i < array.length; i++ ) {
            this.ctx.lineTo(i, this.state.baseY - array[i])
        }
        this.ctx.lineTo(this.width, this.state.baseY)
//        this.ctx.lineTo(this.width, 0)
//        this.ctx.lineTo(0, 0)
        this.ctx.fill()
    }

    render(){
        return (
            <div>
                <audio id='audio' src={audioUrl} controls={true} >
                    您的浏览器不支持 audio 标签
                </audio>
                <canvas id='waveCanvas'></canvas>
            </div>
        )
    }
}

function mapStateToProps({ audio }){
	return { audio };
}

export default connect(mapStateToProps)(Audio);
