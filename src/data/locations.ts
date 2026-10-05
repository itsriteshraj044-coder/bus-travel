export interface Place {
  id: string
  mr: string
  en: string
}

const p = (id: string, mr: string, en: string): Place => ({ id, mr, en })

/** 33 village pickup points, listed in route order towards Pune. */
export const VILLAGES: Place[] = [
  p('walwad', 'वालवड', 'Walwad'),
  p('samangaon-phata', 'सामनगाव फाटा', 'Samangaon Phata'),
  p('walha', 'वाल्हा', 'Walha'),
  p('kukkadgaon', 'कुक्कडगाव', 'Kukkadgaon'),
  p('malkapur', 'माळकापूर', 'Malkapur'),
  p('ratnapur', 'रत्नापूर', 'Ratnapur'),
  p('anala', 'अनाळा', 'Anala'),
  p('mugaon', 'मुगाव', 'Mugaon'),
  p('sonari', 'सोनारी', 'Sonari'),
  p('ingoda', 'इंगोदा', 'Ingoda'),
  p('hingangaon', 'हिंगणगाव', 'Hingangaon'),
  p('watefal', 'वातेफळ', 'Watefal'),
  p('chinchpur-garad', 'चिंचपूर गरड', 'Chinchpur Garad'),
  p('lonarwadi-phata', 'लोणारवाडी फाटा', 'Lonarwadi Phata'),
  p('pandharewadi', 'पांढरेवाडी', 'Pandharewadi'),
  p('maniknagar', 'माणिकनगर', 'Maniknagar'),
  p('shelgaon', 'शेळगाव', 'Shelgaon'),
  p('tandulwadi', 'तांदुळवाडी', 'Tandulwadi'),
  p('kokarwadi', 'कोकरवाडी', 'Kokarwadi'),
  p('dhargaon', 'धारगाव', 'Dhargaon'),
  p('eet', 'ईट', 'Eet'),
  p('bhum', 'भूम', 'Bhum'),
  p('ambi', 'आंबी', 'Ambi'),
  p('paranda', 'परांडा', 'Paranda'),
  p('diksal', 'डिकसळ', 'Diksal'),
  p('karmala', 'करमाळा', 'Karmala'),
  p('jeur', 'जेऊर', 'Jeur'),
  p('kurduwadi', 'कुर्डुवाडी', 'Kurduwadi'),
  p('tembhurni', 'टेंभुर्णी', 'Tembhurni'),
  p('kumbhargaon', 'कुंभारगाव', 'Kumbhargaon'),
  p('bhigwan', 'भिगवण', 'Bhigwan'),
  p('indapur', 'इंदापूर', 'Indapur'),
  p('pargaon', 'पारगाव', 'Pargaon'),
]

/** 32 Pune stops, listed in the order the bus reaches them. */
export const PUNE_STOPS: Place[] = [
  p('yavat', 'यवत', 'Yavat'),
  p('naygaon-phata', 'नायगाव फाटा', 'Naygaon Phata'),
  p('uruli', 'उरुळी कांचन', 'Uruli Kanchan'),
  p('kunjirwadi', 'कुंजीरवाडी', 'Kunjirwadi'),
  p('theur-phata', 'थेऊर फाटा', 'Theur Phata'),
  p('loni', 'लोणी काळभोर', 'Loni Kalbhor'),
  p('shewalwadi', 'शेवाळवाडी', 'Shewalwadi'),
  p('hadapsar', 'हडपसर', 'Hadapsar'),
  p('magarpatta', 'मगरपट्टा', 'Magarpatta'),
  p('noble', 'नोबेल हॉस्पिटल', 'Noble Hospital'),
  p('fatimanagar', 'फातिमानगर', 'Fatimanagar'),
  p('pulgate', 'पुलगेट', 'Pulgate'),
  p('swargate', 'स्वारगेट', 'Swargate'),
  p('dandekar', 'दांडेकर पूल', 'Dandekar Pool'),
  p('deccan', 'डेक्कन', 'Deccan'),
  p('shivajinagar', 'शिवाजीनगर', 'Shivajinagar'),
  p('katraj', 'कात्रज', 'Katraj'),
  p('dhankawadi', 'धनकवडी', 'Dhankawadi'),
  p('sahakarnagar', 'सहकारनगर', 'Sahakarnagar'),
  p('kothrud', 'कोथरूड', 'Kothrud'),
  p('warje', 'वारजे', 'Warje'),
  p('aundh', 'औंध', 'Aundh'),
  p('baner', 'बाणेर', 'Baner'),
  p('wakad', 'वाकड', 'Wakad'),
  p('hinjawadi', 'हिंजवडी', 'Hinjawadi'),
  p('pimpri', 'पिंपरी', 'Pimpri'),
  p('chinchwad', 'चिंचवड', 'Chinchwad'),
  p('akurdi', 'आकुर्डी', 'Akurdi'),
  p('nigdi', 'निगडी', 'Nigdi'),
  p('bhosari', 'भोसरी', 'Bhosari'),
  p('yerawada', 'येरवडा', 'Yerawada'),
  p('vishrantwadi', 'विश्रांतवाडी', 'Vishrantwadi'),
]

const ALL = new Map([...VILLAGES, ...PUNE_STOPS].map((pl) => [pl.id, pl]))

export const findPlace = (id: string) => ALL.get(id)
