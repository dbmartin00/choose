At Thomas' Place

Most single family homes in San Francisco are cramped together town homes, narrow and stacked three stories high.  Thomas had a third floor apartment, a walk up.  You beep him from a talk box at a creatively ambitious wrought iron gate, and at the buzzer you head on up the flight of stairs. 

Thomas greets you at the door.

"This is so crazy dude!  You are like a wanted man now!  And not in the way you want to be wanted."

"Thanks Thomas.  That's just what I need to hear right now."

"Have you got it?"

"The key?  Yeah, it's right here."

"Let's have a look at it.

I'm no software engineer, but I'm pretty good with computers.  Thomas determined that, while interestingly shaped, the inside of the key was a USB-C "thumb" drive.  He copied the contents to a sandbox on his laptop, then began to test it.  How many bytes was it?  Was there any discernible structure to the binary?  Does it match the characteristics of known file types (e.g. the famous OxCAFEBABE byte signature at the top of every Java class file).

It took Thomas about an hour to decide he was up against giga encryption.  Early encryption used 8 bit, 16 bit, and eventually 32 bit encryption.  Then those crazy electrical engineering types gave us 64 and 128 bit encryption, thought to be totally unbeatable.  Giga encryption uses a gigabit for encryption:  1024 * 1024 * 1024 bits.  It takes state of the art hardware to work with this kind of encryption.

There was no way to break down the door.  It might as well be an eight foot thick plate of steel.  But the door isn't the only way to get into the vault.

Thomas was a master, and his black magic baffled me.  It looked like he had dropped down into the linux operating system kernel layer in order to do some file manipulation beneath the file itself.  The key was stored on a journaled filesystem and the file had left a signature in an unencrypted state before being written to its final encrypted form.  A shadow that was invisible to an ordinary user, but not to Thomas and his clutch C code skills.

Suddenly, we had ourselves an unencrypted scret file.

[[2-12] Open the file], or [[2-13] broadcast it over the internet.] 
