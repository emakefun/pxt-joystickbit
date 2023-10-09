enum barb_fitting {
    //% block="LEFT"
    JOYSTICK_BUTOON_LEFT_L = 2,
    //% block="RIGHT" 
    JOYSTICK_BUTOON_RIGHT_R = 1,
    //% block="JOYSTICK BUTTON LEFT"
    JOYSTICK_BUTTON_LEFT = 4,
    //% block="JOYSTICK BUTTON RIGHT" 
    JOYSTICK_BUTTON_RIGHT = 3,
}

enum joystick_key_status {
    //% block="DOWN"
    JOYSTICK_PRESS_DOWN = 0,   //按下
    //% block="UP"
    JOYSTICK_PRESS_UP = 1,    //释放
    //% block="CLICK1"
    JOYSTICK_SINGLE_CLICK = 3,     //单击
    //% block="CLICK2"
    JOYSTICK_DOUBLE_CLICK = 4,    //双击
    //% block="HOLD"
    JOYSTICK_LONG_PRESS_HOLD = 6,    //长按
    //% block="PRESS"
    JOYSTICK_NONE_PRESS = 8,      //未按
}

enum Shaft{
    //% block="X"
    JOYSTICK_X_Shaft = 0,
    //% block="Y"
    JOYSTICK_Y_Shaft = 1,
}

enum Wiggly{
    //% block="LEFT"
    JOYSTICK_left_wi = 0,
    //% block="RIGHT"
    JOYSTICK_right_wi = 1,
}


//% color="#FFA500" weight=10 icon="\uf2c9" block="Joystick:bit"
namespace joystick {
    
    let i2cAddr: number
    let BK: number
    let RS: number
    function setreg(d: number) {
        pins.i2cWriteNumber(i2cAddr, d, NumberFormat.Int8LE)
        basic.pause(1)
    }

    function set(d: number) {
        d = d & 0xF0
        d = d + BK + RS
        setreg(d)
        setreg(d + 4)
        setreg(d)
    }

    function lcdcmd(d: number) {
        RS = 0
        set(d)
        set(d << 4)
    }

    function lcddat(d: number) {
        RS = 1
        set(d)
        set(d << 4)
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cwrite1(addr: number, reg: number, value: number ,value1: string) {
        let lengths = value1.length
        let buf = pins.createBuffer(2+lengths)
        //let arr = value1.split('')
        buf[0] = reg 
        buf[1] = value
        let betys = []
        betys = stringToBytes(value1)
        for (let i = 0; i < betys.length; i++) {
            buf[2+i] = betys[i]
        }
        pins.i2cWriteBuffer(addr, buf)
    }
    
    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    
    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function stringToBytes (str : string) {  

        
        let ch = 0;
        let st = 0;
        let gm:number[]; 
        gm = [];
        for (let i = 0; i < str.length; i++ ) { 
            ch = str.charCodeAt(i);  
            st = 0 ;                 

           do {  
                st = ( ch & 0xFF );  
                ch = ch >> 8;   
                gm.push(st);        
            }    

            while ( ch );  
            
        }  
        return gm;  
    } 

    let JOYSTICK_I2C_ADDR = 0x5A;
    let JOYSTICK_LEFT_X_REG = 0x10;
    let JOYSTICK_LEFT_Y_REG = 0x11;
    let JOYSTICK_RIGHT_X_REG = 0x12;
    let JOYSTICK_RIGHT_Y_REG = 0x13;


    let BUTOON_LEFT_REG = 0x22;
    let BUTOON_RIGHT_REG = 0x23;
    let JOYSTICK_BUTTON_RIGHT = 0x21;
    let JOYSTICK_BUTTON_LEFT = 0x20;
    let NONE_PRESS = 8;

    function Get_Button_Status (button : number){
        switch(button) {
            case 1: 
                return i2cread(JOYSTICK_I2C_ADDR,BUTOON_RIGHT_REG);
            case 2: 
                return i2cread(JOYSTICK_I2C_ADDR, BUTOON_LEFT_REG);
            case 3: 
                return i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_BUTTON_RIGHT);
			case 4: 
				return i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_BUTTON_LEFT);
            default:
                return 0xff;
        }
    }

   /**
    * 双摇杆手柄
    */
   //% blockId=Gamepad_Status block="Gamepad_Status %button whether %status state" group="双摇杆手柄"
   //% weight=74
   //% subcategory="双摇杆手柄"
   //% inlineInputMode=inline
   export function Gamepad_Status(button: barb_fitting , status: joystick_key_status): boolean{
       if(Get_Button_Status(button) == status){
           return true;
       }
       return false;
    }


    /**
    * 双摇杆手柄
    */
   //% blockId=Gamepad_shock block="Gamepad_shock Start of %shock vibration "  group="双摇杆手柄"
   //% shock.min=0 shock.max=255
   //% weight=75
   //% subcategory="双摇杆手柄"
   //% inlineInputMode=inline
    export function Gamepad_shock( shock: number): void {
        let a = AnalogPin.P1;
        pins.analogWritePin( a , pins.map(
			shock,
			0,
			255,
			0,
			1023
			))
    }

    /**
    * 双摇杆手柄
    */
   //% blockId=Gamepad_Wiggly block="Gamepad_Wiggly gain %rock rocker %axial price" group="双摇杆手柄"
   //% weight=76
   //% subcategory="双摇杆手柄"
   //% inlineInputMode=inline
   export function Gamepad_Wiggly(rock: Wiggly , axial: Shaft){
       let val = 0;
       if(rock == 0){
           if(axial == 0){
               val = i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_LEFT_X_REG);
           }else{
               val = i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_LEFT_Y_REG);
           }
       }else{
           if(axial == 0){
               val = i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_RIGHT_X_REG);
           }else{
               val = i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_RIGHT_Y_REG);
           }
       }
       return val;
   }
}

