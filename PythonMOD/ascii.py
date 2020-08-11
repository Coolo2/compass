
class Dec:


    def Bin(decimal, return_type=bin):
        if type(decimal) is list:
            return_list = []
            for number in decimal:
                try:
                    binary = bin(int(number))
                    try:
                        if return_type == bin:
                            return_list.append(binary)
                        else: 
                            return_list.append(return_type(str(binary)[2:]))
                    except:
                        raise TypeError('Invalid return type')
                except:
                    try:
                        return_list.append(return_type(0))
                    except:
                        raise TypeError('Invalid return type')

            return return_list

        else:

            try:
                binary = bin(int(decimal))
                try:
                    if return_type == bin:
                        return binary
                    else:
                        return return_type(str(binary)[2:])
                except:
                    raise TypeError('Invalid return type')

            except Exception as e:
                raise Exception('Invalid decimal.')

    binary, Binary = Bin, Bin


    def Letter(input_number, repeat=False):
        if repeat == False or repeat in ['false', 'False', '0', 0]:
            if type(input_number) is list:
                return_list = []
                for number in input_number:
                    try:
                        number = int(number)
                    except:
                        number = None
                    done =0
                    counter = 0
                    for letter in "abcdefghijklmnopqrstuvwxyz":

                        counter = counter + 1
                        
                        if counter == number:
                            done = 1
                            return_list.append(letter)
                    if done != 1:
                        return_list.append(None)

                return return_list

            else:
                counter = 0
                try:
                    number = int(input_number)
                except:
                    raise Exception('Invalid decimal')
                for letter in "abcdefghijklmnopqrstuvwxyz":

                    counter = counter + 1


                    if counter == input_number:
                        return letter
        elif repeat == True or repeat in ['true', 'True', '1', 1]:
            if type(input_number) is list:
                return_list = []
                
                for number in input_number:
                    
                    try:
                        number = int(number)
                    except:
                        number = None

                    counter = 0
                    
                    complete = False
                    while complete == False:
                        
                        for letter in "abcdefghijklmnopqrstuvwxyz":

                            counter = counter + 1
                            
                            digit = False
                            if str(number).isalpha():
                                digit = True

                            if counter == number:
                                done = 1
                                return_list.append(letter)
                                complete = True
                        if digit == True:
                            return_list.append(None)
                            complete = True

                return return_list
            else:
                counter = 0
                try:
                    number = int(input_number)
                except:
                    raise Exception('Invalid decimal')

                complete = False
                while complete == False:
                    for letter in "abcdefghijklmnopqrstuvwxyz":

                        counter = counter + 1

                        if counter == number:
                            return letter
                            complete = True
        else:
            raise TypeError('Incorrect value for `repeat=`')
    
    letter, let, Let = Letter, Letter, Letter

decimal, dec, Decimal = Dec, Dec, Dec

class Bin:


    def Dec(binary, return_type=int):
        if type(binary) is list:
            return_list = []
            for number in binary:
                wentinto = 0
                if type(number) is int:
                    number= str(int(str(number).replace("0b", "")))
                    wentinto = 1
                for non_binary in ['2', '3', '4', '5', '6', '7', '8', '9']:
                    if non_binary in number:
                        if wentinto == 1:
                            return_list.append(return_type(number))
                        else:
                            binary = 0



                try:
                    binary = int(str(number.replace('0b', '')))
                except:
                    binary = 0
                
                
                decimal = 0 #create decimal variable
                
                binary = list(str(binary)) #convert the binary into a list
                binary = binary[::-1]      #reverse the list
                
                power = 0   #make power variable
                
                
                for number in binary:
                    if number == '1':
                        
                        decimal += 2**power    
                    
                    power += 1 #increase the power variable by one  
                
                if wentinto != 1:
                    try:
                        return_list.append(return_type(decimal))
                    
                    except:
                        return_list.append(return_type("0"))


            return return_list

        else:
            wentinto = 0
            if type(binary) is int:
                binary = str(int(str(binary).replace("0b", "")))
                wentinto = 1
            for non_binary in ['2', '3', '4', '5', '6', '7', '8', '9']:
                if non_binary in binary:
                    if wentinto == 1:
                        return binary 
                    else:
                        raise TypeError('Invalid binary number')

            try:
                binary = int(str(binary).replace('0b', ''))
            except:
                raise TypeError('Invalid binary number')
            
            
            decimal = 0 #create decimal variable
            
            binary = list(str(binary)) #convert the binary into a list
            binary = binary[::-1]      #reverse the list
            
            power = 0   #make power variable
            
            
            for number in binary:
                if number == '1':
                    
                    decimal += 2**power    
                
                power += 1 #increase the power variable by one  
            
            try:
                return return_type(decimal)
            
            except:
                raise TypeError('Invalid return type')
    
    dec, decimal, Decimal = Dec, Dec, Dec

binary, Binary = Bin, Bin

class Ascii:

    def Letter(input_ascii):
        b = input_ascii
        if type(b) is str:
            if "," in b and ", " not in b:
                final = b.split(",")
            elif ", " in b:
                final = b.split(", ")
            elif " " in b and ',' not in b:
                final = b.split(" ")
            else:
                final = [b]
        if type(b) is list:
            final = []
            for item in b:
                try:
                    final.append(bin(item))
                except:
                    final.append(str(item))
        try:
            return ''.join([chr(int(x, 2)) for x in final])
        except:
            raise Exception('Invalid Ascii')
    
    letter, Let, let, string, Str, String = Letter, Letter, Letter, Letter, Letter, Letter, 

asc, Asc, asciibinary, AsciiBinary, Asciibinary = Ascii, Ascii, Ascii, Ascii, Ascii

class Letter:

    def Decimal(input_letter, return_type=int):
        if return_type not in [int, str]:
            raise TypeError('Invalid return type')
        
        
        if type(input_letter) is list or type(input_letter) is str and len(input_letter) > 1:
            return_list = []
            
            for letter in input_letter:
                
                if not letter.isalpha():
                    return_list.append(None)
                
                
                else:
                    counter = 0
                    
                    for alp in "abcdefghijklmnopqrstuvwxyz":
                        
                        
                        counter = counter + 1
                        if letter.lower() == alp:
                            
                            return_list.append(return_type(counter))
            
            
            return return_list
        
        
        elif type(input_letter) is str:
            
            if not input_letter.isalpha():
                raise Exception('Invalid letter')
            
            
            else:
                counter = 0

                for alp in "abcdefghijklmnopqrstuvwxyz":

                    counter = counter + 1

                    if input_letter.lower() == alp:

                        return return_type(counter)

    
    dec, Dec, decimal = Decimal, Decimal, Decimal

    def Ascii(input_string):
        s = input_string

        if type(s) is not list:

            b = []
            for character in s:

                b.append(character)

        else:
            b = s

        return [bin(ord(x))[2:].zfill(8) for x in b]
    
    asc, Asc, asciibinary, AsciiBinary, Asciibinary = Ascii, Ascii, Ascii, Ascii, Ascii


letter, string, String, Str, let, Let = Letter, Letter, Letter, Letter, Letter, Letter

class Detect:
            
    def asciistring(input, return_type=str):

        if return_type == list:
            if True in [c in input for c in "abcdefghijklmnopqrstuvwxyz!@#$%^&*()23456789[];'\,./<>?:|-_ABCDEFGHIJKLMNOPQRSTUVWXYZ="]:

                return Letter.asciibinary(input)
            
            else:
                return asciibinary.Letter(input)
        if return_type == str:

            if True in [c in input for c in "abcdefghijklmnopqrstuvwxyz!@#$%^&*()23456789[];'\,./<>?:|-_ABCDEFGHIJKLMNOPQRSTUVWXYZ="]:

                return ' '.join(Letter.asciibinary(input))
            
            else:
                return asciibinary.Letter(input)
    
    stringascii, StringAscii, Stringascii, Asciistring, AsciiString = asciistring, asciistring, asciistring, asciistring, asciistring

    def binarydecimal(input):

        if True in [c in str(input) for c in "23456789"]:
            return Decimal.Binary(input, return_type=str)
            
        else:
            return Binary.Decimal(input)
    
    decimalbinary, Decimalbinary, DecimalBinary, Binarydecimal, BinaryDecimal = binarydecimal, binarydecimal, binarydecimal, binarydecimal, binarydecimal

    def celsiusfarenheit(input):

        if type(input) is list:
            finallist = []
            for item in input:
                if "c" in str(item):
                    try:
                        finallist.append(celsius.farenheit(item))
                    except:
                        finallist.append(None)
                elif "f" in str(item):
                    try:
                        finallist.append(farenheit.celsius(item))
                    except:
                        finallist.append(None)
                else:
                    finallist.append(None)
            return finallist
        else:
            if "c" in str(input):
                return celsius.farenheit(input)
            elif "f" in str(input):
                return farenheit.celsius(input)
            else:
                raise Exception("Could not detect input type, maybe add a 'c' or 'f'?")
    
    farenheitcelsius, Farenheitcelsius, FarenheitCelsius, CelsiusFarenheit, Celsiusfarenheit = celsiusfarenheit, celsiusfarenheit, celsiusfarenheit, celsiusfarenheit, celsiusfarenheit

detect = Detect

class Celsius:

    def Farenheit(Celsius):

        if type(Celsius) is list: 
            
            finallist = []
            for item in Celsius:
                if type(item) is str:
                    item = item.lower().replace("°", "").replace("celsius", "").replace("c", "").replace("degrees", "").replace(" ", "")
                try:
                    finallist.append((int(item) * 9/5) + 32)
                except:
                    finallist.append(None)
            return finallist
        
        
        else:
            if type(Celsius) is str:
                Celsius = Celsius.lower().replace("°", "").replace("celsius", "").replace("c", "").replace("degrees", "").replace(" ", "")

            try:
                return (int(Celsius) * 9/5) + 32
            except:
                raise Exception("Invalid temperature")

    farenheit, f, degreesf, degrees_f = Farenheit, Farenheit, Farenheit, Farenheit

celsius, c, degreesc, degrees_c = Celsius, Celsius, Celsius, Celsius

class Farenheit:
    def Celsius(Farenheit):
        if type(Farenheit) is list: 
            
            finallist = []
            for item in Farenheit:
                if type(item) is str:
                    item = item.lower().replace("°", "").replace("farenheit", "").replace("f", "").replace("degrees", "").replace(" ", "")
                try:
                    finallist.append((int(item) - 32) * 5/9)
                except:
                    finallist.append(None)
            return finallist
        
        
        else:
            if type(Farenheit) is str:
                Farenheit = Farenheit.lower().replace("°", "").replace("farenheit", "").replace("f", "").replace("degrees", "").replace(" ", "")

            try:
                return ((int(Farenheit) - 32) * 5/9)
            except:
                raise Exception("Invalid temperature")
    
    celsius, c, degreesc, degrees_c = Celsius, Celsius, Celsius, Celsius

farenheit, f, degreesf, degrees_f = Farenheit, Farenheit, Farenheit, Farenheit




print(detect.asciistring('..args..'))