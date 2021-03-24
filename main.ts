//% color="#FFA500" weight=10 icon="\uf2c9" block="Joystick:bit"
namespace joystickbit {
   
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
            case 0: 
                return i2cread(JOYSTICK_I2C_ADDR,BUTOON_LEFT_REG);
            case 1: 
                return i2cread(JOYSTICK_I2C_ADDR,BUTOON_RIGHT_REG);
            case 2: 
                return i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_BUTTON_LEFT);
            case 3: 
                return i2cread(JOYSTICK_I2C_ADDR,JOYSTICK_BUTTON_RIGHT);
            default:
                return 0xff;
        }
    }

    /**
     * 双摇杆手柄
     */
    //% blockId=Gamepad_Press block="Gamepad_Press bottons whether %button pressed?" group="双摇杆手柄"
    //% weight=74
    //% subcategory="基础输入模块"
    //% inlineInputMode=inline
    export function Gamepad_Press(button: barb_fitting): boolean {
        if(Get_Button_Status(button) != NONE_PRESS && Get_Button_Status (button) != 0xff){
            return true;
        }
        return false;
    }

    /** 
     * 双摇杆手柄
    */
   //% blockId=Gamepad_Release block="Gamepad_Release bottons whether %button pressed?" group="双摇杆手柄"
   //% weight=74
   //% subcategory="基础输入模块"
   //% inlineInputMode=inline
   export function Gamepad_Release(button: barb_fitting): boolean {
       if(Get_Button_Status(button) == NONE_PRESS){
           return true;
       }
       return false;
   }

   /**
    * 双摇杆手柄
    */
   //% blockId=Gamepad_Status block="Gamepad_Status %button whether %status state" group="双摇杆手柄"
   //% weight=74
   //% subcategory="基础输入模块"
   //% inlineInputMode=inline
   export function Gamepad_Status(button: barb_fitting , status: key_status): boolean{
       if(Get_Button_Status(button) == status){
           return true;
       }
       return false;
    }


    /**
    * 双摇杆手柄
    */
   //% blockId=Gamepad_shock block="Gamepad_shock Start of %freq vibration "  group="双摇杆手柄"
   //% weight=74
   //% subcategory="基础输入模块"
   //% inlineInputMode=inline
    export function Gamepad_shock( shock: number): void {
        let a = AnalogPin.P1;
        pins.analogWritePin( a , shock)
    }



    /**
    * 双摇杆手柄
    */
   //% blockId=Gamepad_Wiggly block="Gamepad_Wiggly gain %rock rocker %axial price" group="双摇杆手柄"
   //% weight=74
   //% subcategory="基础输入模块"
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
