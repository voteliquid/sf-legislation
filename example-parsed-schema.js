// Example datatype to parse the agenda into
// from ./pdfs/bag110116_agenda.pdf

module.export = {
  date: 'Tuesday, November 1, 2016 - 2:00PM',
  consentAgenda: [
    { section: 'Recommendations of the Land Use and Transportation Committee',
      bills: [
        {
          itemNumber: 1,
          id: 160424,
          title: 'Planning Code, Zoning Map - Sign Regulations',
          sponsors: ['Peskin', 'Cohen'],
          text: 'Ordinance amending the Planning Code to correct and update provisions, delete obsolete or redundant sections, amend the definitions of Historic Sign and Wind Sign, reinstate the distinction between Historic and Vintage Signs, and further restrict the areas where General Advertising Signs are permitted; amending the Zoning Map to delete the Showplace Square Special Sign District, the South of Market General Advertising Special Sign District, the Hamm’s Building Historic Special Sign District, and the Candlestick Park Special Sign District, and to delete the related Code sections; affirming the Planning Department’s determination under the California Environmental Quality Act; and making findings of consistency with the General Plan, and the eight priority policies of Planning Code, Section 101.1, and findings of public convenience, necessity, and welfare under Planning Code, Section 302.',
          statusLog: [
            {
              date: '10/25/2016',
              status: 'PASSED, ON FIRST READING.',
            },
          ],
          fiscalImpact: false,
          question: 'Shall this Ordinance be FINALLY PASSED?',
        },
        {
          itemNumber: 2,
          id: 160553,
          title: 'Planning Code - Signs - Exemptions and General Advertising Sign Penalties',
          sponsors: ['Peskin', 'Mar'],
          text: 'Ordinance amending the Planning Code to clarify that all noncommercial Signs are exempt from regulation pursuant to Planning Code, Article 6; increase penalties for repeat violations for the display of illegal General Advertising Signs; shorten the time before penalties for General Advertising Sign violations begin to accrue; allow property liens for such penalties that go unpaid; affirming the Planning Department’s determination under the California Environmental Quality Act; and making findings of consistency with the General Plan, and the eight priority policies of Planning Code, Section 101.1, and a finding of public necessity, convenience, and welfare under Planning Code, Section 302.',
          statusLog: [
            {
              date: '10/25/2016',
              status: 'PASSED, ON FIRST READING.',
            },
          ],
          fiscalImpact: false,
          question: 'Shall this Ordinance be FINALLY PASSED?',
        },
      ],
    },
  ],
}
